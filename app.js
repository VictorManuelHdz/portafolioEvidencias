const urlApi = 'https://api.github.com/users/VictorManuelHdz';

// Función genérica para obtener datos (evita repetir fetch)
const fetchGithub = async (endpoint) => {
    try {
        const response = await fetch(`${urlApi}${endpoint}`);
        return await response.json();
    } catch (error) {
        console.error("Error obteniendo datos:", error);
    }
};

const cargarPerfil = async () => {
    const user = await fetchGithub('');
    const contenedor = document.getElementById("perfil-container");
    
    // Usamos una estructura más limpia para el HTML
    contenedor.innerHTML = `
        <div class="profile-header">
            <img src="${user.avatar_url}" alt="Avatar" class="rounded-circle border border-4 border-light shadow" width="150">
            <h1 class="mt-3 fw-bold">${user.name || user.login}</h1>
            <p class="fst-italic opacity-75">${user.bio || 'Sin biografía disponible'}</p>
            <span class="badge rounded-pill bg-info text-dark">${user.location || 'Planeta Tierra'}</span>
        </div>
    `;
};

const cargarRepos = async () => {
    // Usamos 'pushed' para traer donde hubo cambios de código recientes
    // 'direction=desc' asegura que los más nuevos aparezcan primero
    const repos = await fetchGithub('/repos?sort=pushed&direction=desc&per_page=6');
    
    const contenedor = document.getElementById("repos-container");
    if (!contenedor) return; // Seguridad por si el ID cambia
    
    contenedor.innerHTML = "";

    repos.forEach(repo => {
        const card = `
            <div class="col">
                <div class="card h-100 border-0 shadow-sm hover-effect">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <h5 class="card-title text-dark fw-bold mb-0">${repo.name}</h5>
                            <span class="badge bg-light text-muted" style="font-size: 0.7rem;">
                                ${new Date(repo.pushed_at).toLocaleDateString()}
                            </span>
                        </div>
                        <p class="card-text text-secondary small">
                            ${repo.description || 'Sin descripción disponible para este proyecto.'}
                        </p>
                    </div>
                    <div class="card-footer bg-transparent border-0 pb-3">
                        <a href="${repo.html_url}" target="_blank" class="btn btn-sm btn-dark w-100">Ver Repositorio</a>
                    </div>
                </div>
            </div>
        `;
        contenedor.insertAdjacentHTML('beforeend', card);
    });
};

const cargarSeguidores = async () => {
    // Limitamos a 5 seguidores con el parámetro per_page
    const seguidores = await fetchGithub('/followers?per_page=5');
    const lista = document.getElementById("followers-container");
    lista.innerHTML = "";

    seguidores.forEach(s => {
        const item = `
            <div class="text-center mb-3 mx-2">
                <img src="${s.avatar_url}" class="rounded-circle shadow-sm" width="50" title="${s.login}">
                <p class="small mt-1">${s.login}</p>
            </div>
        `;
        lista.insertAdjacentHTML('beforeend', item);
    });
};

// Iniciar todo
cargarPerfil();
cargarRepos();
cargarSeguidores();