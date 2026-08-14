const sidebar = document.getElementById('sidebar');
const mainContent = document.getElementById('mainContent');
const toggleSidebar = document.getElementById('toggleSidebar');
const navLabels = document.querySelectorAll('.nav-label');
const navItems = document.querySelectorAll('.nav-item');

let isSidebarOpen = false;

const updateSidebar = () => {
    sidebar.classList.toggle('sidebar-open', isSidebarOpen);
    sidebar.classList.toggle('sidebar-collapsed', !isSidebarOpen);

    mainContent.classList.toggle('main-content-expanded', isSidebarOpen);
    mainContent.classList.toggle('main-content-collapsed', !isSidebarOpen);

    toggleSidebar.setAttribute('aria-expanded', String(isSidebarOpen));
    toggleSidebar.textContent = isSidebarOpen ? '✕' : '☰';

    navLabels.forEach((label) => {
        label.style.opacity = isSidebarOpen ? '1' : '0';
        label.style.visibility = isSidebarOpen ? 'visible' : 'hidden';
        label.style.transform = isSidebarOpen ? 'translateX(0)' : 'translateX(-8px)';
    });

    navItems.forEach((item) => {
        item.classList.toggle('justify-center', !isSidebarOpen);
    });
};

toggleSidebar.addEventListener('click', () => {
    isSidebarOpen = !isSidebarOpen;
    updateSidebar();
});

document.getElementById('logoutButton')?.addEventListener('click', () => {
    Swal.fire({
        title: '¿Cerrar sesión?',
        text: 'Estás a punto de salir de tu cuenta.',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, salir',
        cancelButtonText: 'Cancelar'
    });
});

updateSidebar();
