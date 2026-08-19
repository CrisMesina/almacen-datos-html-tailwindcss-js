// Importaciones de firebase necesarios para el funcionamiento

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, getDocs, collection, query, where, and, orderBy, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

// Configuracion entregada por firebase.

const firebaseConfig = {
    apiKey: "AIzaSyCMkrzx6ILBdPoSTuMU9XkDxaLBpl0ifQA",
    authDomain: "almacen-353eb.firebaseapp.com",
    projectId: "almacen-353eb",
    storageBucket: "almacen-353eb.firebasestorage.app",
    messagingSenderId: "224014911475",
    appId: "1:224014911475:web:d85594f97fd4491eca7486"
};

// Iniciar firebase en proyecto jiji

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);




// ============================================================================================================ //
// ======================================                            ========================================== //
// ======================================  AUTENTICACION DE USUARIO  ========================================== //
// ======================================                            ========================================== //
// ============================================================================================================ //



onAuthStateChanged(auth, async (usuario) => {
    if (!usuario) return;

    // Recuperar nombre del usuario logueado
    const userDoc = await getDoc(doc(db, "usuarios", usuario.uid));
    const nombre = userDoc.exists() ? userDoc.data().nombre : usuario.nomnre || usuario.email;

    // Incorporar nombre de usuario logueado en etiqueta html
    const nombreUsuario = document.getElementById("nombre-usuario");
    if (nombreUsuario) {
        nombreUsuario.innerHTML = "Bienvenid@ " +"<span class='text-purple-500'>" + nombre + "!</span>";
    }

    mostrarNotas();
})



const btnRegister = document.getElementById("registrarUsuario");
const btnIngresar = document.getElementById("iniciarSesion");
const btnCerrarSesion = document.getElementById("logoutButton");

// ============================================================================================================ //
// ======================================                            ========================================== //
// ======================================      INICIO DE SESION      ========================================== //
// ======================================                            ========================================== //
// ============================================================================================================ //

if (btnIngresar) {
    btnIngresar.addEventListener('click', async (e) => {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const contraseña = document.getElementById("contraseña").value.trim();

        if (!email || !contraseña) {
            Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: false,
            }).fire({
                icon: "error",
                title: "Debes ingresar los datos para poder entrar."                
            })
            return;
        }

        btnIngresar.disabled = true;
        btnIngresar.textContent = "Cargando";
        btnIngresar.classList.add("opacity-70", "cursor-not-allowed");

        try {
            await signInWithEmailAndPassword(auth, email, contraseña);
            Swal.mixin({
                toast: true,
                position: "top-end",
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: false,
            }).fire({
                icon: "success",
                title: "Ingresando..."                
            })
            setTimeout(() => {
                window.location.href = "/templates/home.html";
            }, 3000)
        } catch (error) {
            btnIngresar.disabled = false;
            btnIngresar.textContent = "Iniciar sesión";
            btnIngresar.classList.remove("opacity-70", "cursor-not-allowed");
            alert("ERROR: " + error.message);
        }
    });
}





// ============================================================================================================ //
// ======================================                            ========================================== //
// ======================================        REGISTRARSE         ========================================== //
// ======================================                            ========================================== //
// ============================================================================================================ //


if (btnRegister) {
    btnRegister.addEventListener('click', async (e) => {
        e.preventDefault();

        const nombre = document.getElementById("nombre").value.trim();
        const email = document.getElementById("email").value.trim();
        const contraseña = document.getElementById("contraseña").value.trim();

        if (!email || !contraseña || !nombre) {
            alert("NO SE PUEDE REGISTRAR NADA, RELLENA LOS CAMPOS");
            return;
        }

        btnRegister.disabled = true;
        btnRegister.textContent = "Cargando";
        btnRegister.classList.add("opacity-70", "cursor-not-allowed");

        try {
            const credencialUsuario = await createUserWithEmailAndPassword(auth, email, contraseña);
            const usuario = credencialUsuario.user;

            await setDoc(doc(db, "usuarios", usuario.uid), {
                nombre,
                email,
                contraseña
            });

            btnRegister.disabled = false;
            btnRegister.textContent = "Crear cuenta";
            btnRegister.classList.remove("opacity-70", "cursor-not-allowed");

            alert("Usuario creado");
            window.location.href = "/index.html";
        } catch (error) {
            btnRegister.disabled = false;
            btnRegister.textContent = "Crear cuenta";
            btnRegister.classList.remove("opacity-70", "cursor-not-allowed");
            alert("ERROR: " + error.message);
        }
    });
}


// ============================================================================================================ //
// ======================================                            ========================================== //
// ======================================      MUESTRA DE NOTAS      ========================================== //
// ======================================                            ========================================== //
// ============================================================================================================ //


// ------------------ Formatear Fecha ------------------ //

const formatearFecha = (timestamp) => {
    if(!timestamp) return "";

    const fecha = timestamp.toDate();

    return fecha.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "long",
        year: "numeric"
    });

}

// ------------------ Formatear Fecha ------------------ //


const contenedorNotas = document.getElementById("mostrar-notas");
const btnMisNotas = document.getElementById("notasPersonales");
const btnNotas = document.getElementById("notas");



const mostrarMisNotas = async (uid) =>{
    if(!contenedorNotas) return;
    
    const q = query(
        collection(db, "notas"),
        where("uid", "==", uid),
    );

    const snapshop = await getDocs(q);
    contenedorNotas.innerHTML = "";
    
    if(snapshop.empty){
        contenedorNotas.innerHTML = '<p class="text-white ml-25 mt-10 font-bold text-2xl"> NO HAS CREADO NINGUNA NOTA </p>';
        return;
    }

    snapshop.forEach((docSnap) => {
        const nota =  docSnap.data();
        const div = document.createElement("div");
        div.className = "rounded-2xl ml-25 border text-white mt-5 border-slate-700 bg-slate-900/80 p-5 shadow-lg shadow-slate-950/30 transition hover:border-violet-400/50 mx-4 mb-4";
        div.innerHTML = `
            <div class="mb-3 flex items-center justify-between gap-3">
                <span class="rounded-full bg-violet-500/15 px-2.5 py-1 text-xs font-medium text-violet-200">Nota ${nota.visibilidad}</span>
                <p class="text-xs text-slate-400">${formatearFecha(nota.creadoEl)}</p>
            </div>
            <h3 class="text-xl font-semibold text-white">${nota.titulo}</h3>
            <p class="mt-3 whitespace-pre-line text-sm leading-6 text-slate-300">${nota.contenido}</p>
        `;
        contenedorNotas.appendChild(div)
    })    
}



const mostrarNotas = async () => {
    if(!contenedorNotas) return;

    const q  =  query(
        collection(db, "notas"),
        where("visibilidad", "==" , "publica"),
    );
    contenedorNotas.innerHTML = "";

    
    const snapshop = await getDocs(q);
    
    if(snapshop.empty){
        contenedorNotas.innerHTML = '<p class="text-white ml-25 mt-10 font-bold text-2xl"> NO HAS CREADO NINGUNA NOTA </p>';
        return;
    }

    snapshop.forEach((docSnap) => {
        const nota =  docSnap.data();
        const div = document.createElement("div");
        div.className = "rounded-2xl ml-25 border text-white mt-5 border-slate-700 bg-slate-900/80 p-5 shadow-lg shadow-slate-950/30 transition hover:border-violet-400/50 mx-4 mb-4";
        div.innerHTML = `
            <div class="mb-3 flex items-center justify-between gap-3">
                <span class="rounded-full bg-violet-500/15 px-2.5 py-1 text-xs font-medium text-violet-200">Nota</span>
                <p class="text-xs text-slate-400">${formatearFecha(nota.creadoEl)}</p>
            </div>
            <h3 class="text-xl font-semibold text-white">${nota.titulo}</h3>
            <p class="mt-3 whitespace-pre-line text-sm leading-6 text-slate-300">${nota.contenido}</p>
        `;

        contenedorNotas.appendChild(div)
    })
}

// AL PRESIONAR BOTON, SE MUESTRAN NOTAS PERSONALES


if (btnMisNotas) {
    btnMisNotas.addEventListener('click', async (e) => {
        e.preventDefault();
        const usuario = auth.currentUser;
        if (!usuario) {
            Swal.fire({ icon: 'warning', title: 'Debes iniciar sesión', text: 'Accede para ver tus notas.' });
            return;
        }
        mostrarMisNotas(usuario.uid);
    });
}

// AL PRESIONAR BOTON, SE MUESTRAN TODAS LAS NOTAS

if(btnNotas) {
    btnNotas.addEventListener('click', async(e) => {
        e.preventDefault();
        const usuario = auth.currentUser;
        if(!usuario){
            Swal.fire({ icon: 'warning', title: 'Debes iniciar sesión', text: 'Accede para ver tus notas.' });
            return;
        }
        mostrarNotas()
    })
}




// ============================================================================================================= //
// ======================================                             ========================================== //
// ======================================      CREACION DE NOTAS      ========================================== //
// ======================================                             ========================================== //
// ============================================================================================================= //


// Capturar boton para crear notas 

const btnAbrirForm = document.getElementById("btnAbrirForm")
const sidebar = document.getElementById('sidebar')

// Capturar contenedor para mostrar formulario( formulario usando absolute )

const contenedorHome = document.getElementById("contenedorHome");

const abrirFormulario = () =>{


    contenedorHome.className = "flex"
    contenedorHome.innerHTML = `
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
            <div class="w-full max-w-2xl rounded-2xl bg-slate-900 text-white p-6 shadow-xl">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-lg font-semibold">Nueva nota</h3>
                    <button id="cancelCrearNota" class="text-slate-400 hover:text-white">✕</button>
                </div>

                <div class="space-y-4">
                    <div>
                        <label for="titulo" class="mb-1 block text-sm text-slate-300">Título</label>
                        <input type="text" id="titulo" class="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder:text-slate-400 focus:border-violet-400 focus:outline-none" placeholder="Ingresa el título de tu nota" />
                    </div>

                    <div>
                        <label for="contenido" class="mb-1 block text-sm text-slate-300">Contenido</label>
                        <textarea id="contenido" rows="6" class="w-full resize-none rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white placeholder:text-slate-400 focus:border-violet-400 focus:outline-none" placeholder="Escribe aquí tu nota..."></textarea>
                    </div>

                    <div>
                        <label for="fecha" class="mb-1 block text-sm text-slate-300">Fecha</label>
                        <input type="date" id="fecha" class="w-full rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-white focus:border-violet-400 focus:outline-none" />
                    </div>
                    
                    <div>
                        <label class="mb-1 block text-sm text-slate-300">Visibilidad de la nota</label>
                        <div class="flex items-center gap-4 mt-5">
                            <label class="inline-flex items-center text-sm">
                                <input type="radio" name="visibilidad" value="publica" checked class="h-4 w-4 text-violet-500" />
                                <span class="ml-2 text-slate-200">Pública</span>
                            </label>
                            <label class="inline-flex items-center text-sm">
                                <input type="radio" name="visibilidad" value="privada" class="h-4 w-4 text-violet-500" />
                                <span class="ml-2 text-slate-200">Privada</span>
                            </label>
                        </div>
                    </div>
                </div>

                <div class="mt-6 flex justify-end gap-3">
                    <button id="crearNota" class="rounded-xl bg-violet-500 px-4 py-2 font-semibold text-white shadow-md hover:bg-violet-400">Crear nota</button>
                    <button id="cancelCrearNota2" class="rounded-xl bg-slate-700 px-4 py-2 text-slate-200 hover:bg-slate-600">Cancelar</button>
                </div>
            </div>
        </div>
    `

    const btnCrearNota = document.getElementById("crearNota")
    const btnCancel1 = document.getElementById("cancelCrearNota")
    const btnCancel2 = document.getElementById("cancelCrearNota2")

    const crearNota = async () => {

        const usuario = auth.currentUser;

        if(!usuario){
            alert("No hay usuario autenticado.")
            return;
        }
        const uid = usuario.uid;

        const titulo = document.getElementById("titulo").value.trim();
        const contenido = document.getElementById("contenido").value.trim();
        const fecha = document.getElementById("fecha").value;
        const visibilidad = document.querySelector('input[name="visibilidad"]:checked')?.value || 'publica';

        if(!titulo || !contenido){
            Swal.fire({icon: 'warning', title: 'Faltan datos', text: 'Completa título y contenido.'})
            return;
        }

        btnCrearNota.disabled = true;
        btnCrearNota.textContent = "Creando...";
        btnCrearNota.classList.add("opacity-70", "cursor-not-allowed");

        try{
            await addDoc(collection(db, "notas"),{
                uid: uid,
                titulo,
                contenido,
                fecha,
                visibilidad,
                creadoEl: serverTimestamp()
            })

            const closeModal = () => { contenedorHome.className = "hidden" }
            closeModal();
            mostrarMisNotas(uid);
            Swal.fire({icon: 'success', title: 'Nota creada'});
       } catch(e){
            btnCrearNota.disabled = false;
            btnCrearNota.textContent = "Crear nota";
            btnCrearNota.classList.remove("opacity-70", "cursor-not-allowed");
            Swal.fire({icon: 'error', title: 'Error', text: String(e)})
        }
    }

    btnCrearNota.addEventListener('click', crearNota)

    const closeModal = () => { contenedorHome.className = "hidden" }
    btnCancel1?.addEventListener('click', closeModal)
    btnCancel2?.addEventListener('click', closeModal)

}
const cerrarFormulario = () =>{
    contenedorHome.className = "hidden"
}

if (sidebar) {
    sidebar.addEventListener('click', (e) => {
        if (e.target.closest('#btnAbrirForm')) {
            abrirFormulario();
        }
    });
} else {
    btnAbrirForm?.addEventListener('click', abrirFormulario);
}


