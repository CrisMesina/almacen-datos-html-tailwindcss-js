// Importaciones de firebase necesarios para el funcionamiento

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/12.17.1/firebase-firestore.js";


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
    if(!usuario){
        window.location.href = "index.html";
        return;
    }

    const userDoc = await getDoc(doc(db, "usuarios", usuario.uid));
    const nombre = userDoc.exists() ? userDoc.data().nombre : usuario.nomnre || usuario.email;

    document.getElementById("nombre-usuario").textContent = nombre;
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
            alert("INGRESA LOS DATOS AWEONAO");
            return;
        }

        try {
            await signInWithEmailAndPassword(auth, email, contraseña);
            alert("Bienvenido usuario :D");
            window.location.href = "templates/home.html";
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
            window.location.href = "index.html";
        } catch (error) {
            alert("ERROR: " + error.message);
        }
    });
}



