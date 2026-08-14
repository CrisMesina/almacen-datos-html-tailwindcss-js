// Importaciones de firebase necesarios para el funcionamiento

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc, getDocs, collection, query, where, orderBy, addDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";

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

let redireccionamiento = false;

onAuthStateChanged(auth, async (usuario) => {

    // Redireccionar a index si no se esta logueado

    if(!usuario){
        if(!redireccionamiento && window.location.pathname !== "/index.html"){
            redireccionamiento = true;
            window.location.replace("/index.html")
            return;
        }
    }


    // Recuperar nombre del usuario logueado

    const userDoc = await getDoc(doc(db, "usuarios", usuario.uid));
    const nombre = userDoc.exists() ? userDoc.data().nombre : usuario.nomnre || usuario.email;

    // Incorporar nombre de usuario logueado en etiqueta html


    document.getElementById("nombre-usuario").textContent = nombre;

    mostrarMisNotas(usuario.uid)
})



const btnRegister = document.getElementById("registrarUsuario");
const btnIngresar = document.getElementById("iniciarSesion");

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

        try {
            await signInWithEmailAndPassword(auth, email, contraseña);
            // SweetAlert2
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

        try {
            const credencialUsuario = await createUserWithEmailAndPassword(auth, email, contraseña);
            const usuario = credencialUsuario.user;

            await setDoc(doc(db, "usuarios", usuario.uid), {
                nombre,
                email,
                contraseña
            });

            alert("Usuario creado");
            window.location.href = "/templates/index.html";
        } catch (error) {
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

const mostrarMisNotas = async (uid) =>{
    if(!contenedorNotas) return;
    

    const q = query(
        collection(db, "notas"),
        where("uid", "==", uid),
    );

    const snapshop = await getDocs(q);
    contenedorNotas.innerHTML = "";
    
    if(snapshop.empty){
        contenedorNotas.innerHTML = "<p> NO HAS CREADO NINGUNA NOTA </p>";
        return;
    }

    snapshop.forEach((docSnap) => {
        const nota =  docSnap.data();
        const div = document.createElement("div");
        div.className = "border rounded-lg p-4 mb-4 mx-5 shadow-mb";
        div.innerHTML = `
            <p class="text-gray-700 text-sm text-end w-full italic mt-1"> ${formatearFecha(nota.creadoEl)} </p>
            <h3 class="text-lg font-bold italic"> ${nota.titulo} </h3>
            <p class="text-gray-700 mt-1"> ${nota.contenido} </h3>
            `
            contenedorNotas.appendChild(div)
    })    
}



// ============================================================================================================= //
// ======================================                             ========================================== //
// ======================================      CREACION DE NOTAS      ========================================== //
// ======================================                             ========================================== //
// ============================================================================================================= //


// Caputrar boton para crear notas

const btnAbrirForm = document.getElementById("btnAbrirForm")

// Capturar contenedor para mostrar formulario ( formulario usando absolute )

const contenedorHome = document.getElementById("contenedorHome");

const abrirFormulario = () =>{

    contenedorHome.className = "flex"
    contenedorHome.innerHTML = `
        <div class="w-full min-h-screen absolute backdrop-blur-sm"></div>
        <div class="absolute z-1 top-50 w-120 p-20 left-64 bg-black text-white rounded-lg flex flex-col">
            <div class="mb-15">
                <input type="text" id="titulo" class="w-full text-center rounded-lg bg-gray-700 placeholder:italic shadow p-5" placeholder="Ingresa el titulo de tu nota" />
            </div>
            <div class="mb-15">
                <textarea id="contenido" class="w-full text-center rounded-lg bg-gray-700 placeholder:italic shadow p-5" placeholder="Ingresa el contenido"></textarea>
            </div>
            <div class="mb-15">
                <input type="date" id="fecha" class="w-full text-center rounded-lg bg-gray-700 placeholder:italic shadow p-5" />
            </div>
            <button id="crearNota" class="text-white p-5 border rounded-lg"> Crear Nota </button>
        </div>
    `

    const btnCrearNota = document.getElementById("crearNota")

    const crearNota = async () => {



        const usuario = auth.currentUser;
        const uid = usuario.uid;

        const titulo = document.getElementById("titulo").value;
        const contenido = document.getElementById("contenido").value;
        const fecha = document.getElementById("fecha").value;

        if(!titulo || !contenido){
            alert("INGRESA DATOS RETARDADO")
            return;
        }


        try{
            await addDoc(collection(db, "notas"),{
                uid: uid,
                titulo,
                contenido,
                fecha,
                creadoEl: serverTimestamp()
            })

            alert("Nota creada")
            window.location.href = "/templates/home.html"
       } catch(e){
            alert("ERROR: " , e)
        }
    }

    btnCrearNota.addEventListener('click', crearNota)


}

const cerrarFormulario = () =>{
    contenedorHome.className = "hidden"
}

btnAbrirForm.addEventListener('click', abrirFormulario);



