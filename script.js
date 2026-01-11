// === REFERENCIAS AL DOM ===
const imageUrlInput = document.getElementById('image-url');
const addBtn = document.getElementById('add-btn');
const deleteBtn = document.getElementById('delete-btn');
const gallery = document.getElementById('gallery');

// Clave usada en localStorage para guardar las imágenes
const STORAGE_KEY = 'galleryImages';

// Variable global para rastrear la imagen seleccionada
let selectedImage = null;

// === FUNCIÓN: Guarda la lista de URLs en localStorage ===
function saveImagesToStorage(imageUrls) {
  try {
    // Convierte el array de URLs a una cadena JSON y lo guarda
    localStorage.setItem(STORAGE_KEY, JSON.stringify(imageUrls));
  } catch (e) {
    console.error('Error al guardar en localStorage:', e);
    alert('No se pudo guardar la galería. El almacenamiento local podría estar deshabilitado.');
  }
}

// === FUNCIÓN: Carga las URLs desde localStorage ===
function loadImagesFromStorage() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    // Si no hay nada guardado, devuelve un array vacío
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error('Error al leer de localStorage:', e);
    return []; // En caso de error, se empieza con la galería vacía
  }
}

// === FUNCIÓN: Renderiza todas las imágenes desde un array de URLs ===
function renderGallery(imageUrls) {
  // Limpia la galería actual
  gallery.innerHTML = '';

  // Recorre cada URL y crea su elemento <img>
  imageUrls.forEach(url => {
    createImageElement(url);
  });
}

// === FUNCIÓN: Crea un contenedor + imagen y añade al DOM ===
function createImageElement(url) {
  // Crea el contenedor (wrapper)
  const wrapper = document.createElement('div');
  wrapper.className = 'image-wrapper';

  // Crea la imagen
  const img = document.createElement('img');
  img.src = url;
  img.alt = 'Imagen guardada';

  // Maneja errores
  img.onerror = () => {
    if (confirm(`No se pudo cargar la imagen:\n${url}\n¿Eliminarla?`)) {
      removeImageByUrl(url);
    }
  };

  // Evento de selección
  wrapper.addEventListener('click', () => {
    // Deseleccionar anterior
    const prevSelected = gallery.querySelector('.image-wrapper.selected');
    if (prevSelected) prevSelected.classList.remove('selected');

    // Seleccionar esta
    wrapper.classList.add('selected');
    selectedImage = wrapper; // Ahora selectedImage es el wrapper
  });

  // Insertar imagen en el wrapper
  wrapper.appendChild(img);

  // Añadir wrapper a la galería
  gallery.appendChild(wrapper);
}
// === FUNCIÓN: Agrega una nueva imagen ===
function addImage() {
  const url = imageUrlInput.value.trim();
  if (!url) {
    alert('Por favor, ingresa una URL válida.');
    return;
  }

  // Carga imágenes actuales desde localStorage
  const currentImages = loadImagesFromStorage();

  // Evita duplicados
  if (currentImages.includes(url)) {
    alert('Esta imagen ya está en la galería.');
    return;
  }

  // Agrega la nueva URL al array
  currentImages.push(url);

  // Guarda el array actualizado
  saveImagesToStorage(currentImages);

  // Crea y muestra la imagen en el DOM
  createImageElement(url);

  // Limpia y enfoca el campo de entrada
  imageUrlInput.value = '';
  imageUrlInput.focus();
}

// === FUNCIÓN: Elimina la imagen seleccionada y actualiza localStorage ===
function deleteSelectedImage() {
  if (!selectedImage || !selectedImage.classList.contains('image-wrapper')) {
    alert('No hay ninguna imagen seleccionada.');
    return;
  }

  const urlToRemove = selectedImage.querySelector('img').src;
  let currentImages = loadImagesFromStorage();
  currentImages = currentImages.filter(url => url !== urlToRemove);
  saveImagesToStorage(currentImages);

  selectedImage.remove();
  selectedImage = null;
}

// === FUNCIÓN AUXILIAR: Elimina una imagen por URL ===
function removeImageByUrl(urlToRemove) {
  let currentImages = loadImagesFromStorage();
  currentImages = currentImages.filter(url => url !== urlToRemove);
  saveImagesToStorage(currentImages);
  renderGallery(currentImages); // Reconstruye toda la galería
  selectedImage = null; // Reinicia selección
}

// === INICIALIZACIÓN DE LA APLICACIÓN ===
document.addEventListener('DOMContentLoaded', () => {
  // Al cargar la página, recuperamos y mostramos las imágenes guardadas
  const savedImages = loadImagesFromStorage();
  renderGallery(savedImages);
});

// === EVENT LISTENERS ===
addBtn.addEventListener('click', addImage);

imageUrlInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    addImage();
  }
});

deleteBtn.addEventListener('click', deleteSelectedImage);