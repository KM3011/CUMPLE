document.addEventListener('DOMContentLoaded', () => {
    // Referencias a los elementos del DOM
    const startBtn = document.getElementById('start-btn');
    const introScreen = document.getElementById('intro-screen');
    const videoContainer = document.getElementById('video-container');
    const imageGallery = document.getElementById('image-gallery');
    const textOverlay = document.getElementById('text-overlay');
    const finalScreen = document.getElementById('final-screen');
    const particlesContainer = document.getElementById('particles-container');
    const lightLeakOverlay = document.getElementById('light-leak-overlay');
    const memoryShapesContainer = document.getElementById('memory-shapes-container');
    
    // Música (opcional, si existe el elemento)
    const bgMusic = document.getElementById('bg-music');

    // CONFIGURACIÓN: Mensajes que aparecerán. Puedes cambiar estos textos.
    const messages = [
        "Un día como hoy...",
        "Celebramos la vida de un hombre increíble.",
        "Nuestro guía, amigo y protector.",
        "Lleno de amor, fuerza y sabiduría.",
        "Gracias por cada momento a tu lado...",
        "Por cada sonrisa y cada consejo...",
        "Por enseñarnos a nunca rendirnos...",
        "Por ser el pilar de nuestra familia...",
        "Eres y siempre serás nuestro héroe.",
        "Nuestra inspiración de cada día.",
        "Eres nuestro mayor ejemplo a seguir.",
        "¡Te amamos muchísimo, Papá!"
    ];

    // CONFIGURACIÓN: Rutas de las imágenes.
    // Asegúrate de que los archivos existan en la carpeta "imagenes".
    const imagePaths = [
        'imagenes/1.jpeg',
        'imagenes/2.jpeg',
        'imagenes/3.jpeg',
        'imagenes/4.jpeg',
        'imagenes/5.jpeg',
        'imagenes/6.jpeg',
        'imagenes/7.jpeg',
        'imagenes/8.jpeg',
        'imagenes/9.jpeg',
        'imagenes/10.jpeg',
        'imagenes/11.jpeg',
        'imagenes/12.jpeg'
    ];

    const validImages = [];
    let currentIndex = 0;
    const slideDuration = 6000; // 6 segundos por cada foto

    // Precargar imágenes
    imagePaths.forEach(src => {
        const img = new Image();
        img.className = 'slide-img';
        
        img.onload = () => {
            // Si la imagen carga, la agregamos a las válidas
            validImages.push({ element: img, src: src });
            imageGallery.appendChild(img);
        };
        
        img.onerror = () => {
            console.warn(`No se encontró la imagen: ${src}`);
        };
        
        img.src = src;
    });

    // Crear partículas decorativas
    createParticles();

    // Evento para iniciar
    startBtn.addEventListener('click', () => {
        // Ocultar pantalla de inicio
        introScreen.style.opacity = '0';
        
        // Intentar reproducir audio si existe
        if (bgMusic) {
            bgMusic.volume = 0.5;
            bgMusic.play().catch(e => console.log("No se pudo reproducir el audio."));
        }

        setTimeout(() => {
            introScreen.classList.remove('active');
            videoContainer.classList.add('active');
            
            // Si no hay imágenes cargadas (ej. la carpeta está vacía o rutas incorrectas)
            if (validImages.length === 0) {
                console.error("No se cargó ninguna imagen. Mostrando final directamente.");
                endSequence();
                return;
            }

            // Iniciar la secuencia de video
            startSequence();
        }, 1500); // Esperar a que se desvanezca el intro
    });

    function startSequence() {
        function showNextSlide() {
            // Efecto cinematográfico: Destello de luz (Light Leak) en la transición
            if (lightLeakOverlay) {
                lightLeakOverlay.classList.remove('flash');
                void lightLeakOverlay.offsetWidth; // Forzar reflow
                lightLeakOverlay.classList.add('flash');
            }

            // Ocultar imagen anterior y crear "estelas"
            if (currentIndex > 0) {
                const prevImg = validImages[(currentIndex - 1) % validImages.length].element;
                prevImg.classList.remove('show');
                
                // 1. Efecto fantasma / estela de la foto principal
                prevImg.classList.add('trail');
                setTimeout(() => prevImg.classList.remove('trail'), 2000);
                
                // 2. Crear un "recuerdo flotante" en el fondo (Historia)
                if (memoryShapesContainer) {
                    const shape = document.createElement('div');
                    shape.className = 'memory-shape active';
                    shape.style.backgroundImage = `url(${prevImg.src})`;
                    // Variar un poco la posición inicial vertical para que no salgan todas igual
                    shape.style.top = `${Math.random() * 40 + 10}%`; 
                    memoryShapesContainer.appendChild(shape);
                    
                    // Limpiar el DOM después de que termine la animación
                    setTimeout(() => shape.remove(), 12000);
                }
            }

            // Ocultar texto actual
            textOverlay.classList.remove('show');

            // Determinar si hemos terminado (mostramos todas las imágenes o mensajes)
            // Aquí lo configuro para que termine cuando se acaben los mensajes
            if (currentIndex >= messages.length) {
                setTimeout(endSequence, 1500);
                return;
            }

            // Mostrar imagen actual (si hay menos imágenes que mensajes, se repiten cíclicamente)
            const currentImg = validImages[currentIndex % validImages.length].element;
            
            // Forzar un reflow para reiniciar la animación CSS si se reutiliza la imagen
            void currentImg.offsetWidth;
            currentImg.classList.add('show');

            // Mostrar el texto correspondiente con un pequeño retraso
            setTimeout(() => {
                textOverlay.textContent = messages[currentIndex];
                textOverlay.classList.add('show');
            }, 1000);

            currentIndex++;

            // Programar la siguiente transición
            setTimeout(showNextSlide, slideDuration);
        }

        // Mostrar la primera diapositiva inmediatamente
        showNextSlide();
    }

    function endSequence() {
        videoContainer.classList.remove('active');
        finalScreen.classList.add('active');
        
        // Crear collage de fondo si no existe
        if (!document.getElementById('collage-bg')) {
            const collage = document.createElement('div');
            collage.id = 'collage-bg';
            
            validImages.forEach(imgObj => {
                const img = document.createElement('img');
                img.src = imgObj.src;
                img.className = 'collage-img';
                collage.appendChild(img);
            });
            
            finalScreen.insertBefore(collage, finalScreen.firstChild);
        }
    }

    // Generador de partículas de fondo
    function createParticles() {
        const colors = ['#ffffff', '#d4af37', '#f9e596'];
        const numParticles = window.innerWidth < 768 ? 20 : 40; // Menos partículas en móvil
        
        for (let i = 0; i < numParticles; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Tamaño entre 2px y 5px
            const size = Math.random() * 3 + 2;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            // Posición y color
            particle.style.left = `${Math.random() * 100}vw`;
            particle.style.top = `${Math.random() * 100}vh`;
            particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            particle.style.boxShadow = `0 0 ${size * 2}px ${particle.style.backgroundColor}`;
            
            // Animación
            const duration = Math.random() * 10 + 10; // 10s - 20s
            const delay = Math.random() * 5;
            particle.style.animation = `floatParticle ${duration}s ${delay}s infinite linear`;
            
            particlesContainer.appendChild(particle);
        }
    }
});
