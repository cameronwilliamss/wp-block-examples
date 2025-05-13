// Glide.js integration for WordPress post loop slider
document.addEventListener('DOMContentLoaded', function () {
    function getPerView(columns) {
        const width = window.innerWidth;
        if (width < 400) return 1;
        if (width < 550) return Math.min(1.5, columns);
        if (width < 850) return Math.min(2, columns);
        if (width < 1150) return Math.min(3, columns);
        if (width < 1450) return Math.min(4, columns);
        if (width < 1700) return Math.min(5, columns);
        return columns;
    }

    const sliders = document.querySelectorAll('.wp-block-post-template.is-style-slider');

    sliders.forEach(slider => {
        const columns = parseInt(slider.classList.value.match(/columns-(\d+)/)[1]);
        const postsCount = slider.querySelectorAll('.wp-block-post').length;
        const currentPerView = getPerView(columns);

        // Skip initialisation if all posts are visible
        if (currentPerView >= postsCount) return;

        slider.classList.add('glide');

        // Replace <ul> with <div> for Glide compatibility
        const sliderDiv = document.createElement('div');
        sliderDiv.classList.add(...slider.classList);
        sliderDiv.innerHTML = slider.innerHTML;
        slider.replaceWith(sliderDiv);
        slider = sliderDiv;

        // Build required Glide structure
        const glideTrack = document.createElement('div');
        glideTrack.classList.add('glide__track');
        glideTrack.setAttribute('data-glide-el', 'track');
        slider.appendChild(glideTrack);

        const glideSlides = document.createElement('ul');
        glideSlides.classList.add('glide__slides');
        glideTrack.appendChild(glideSlides);

        const posts = slider.querySelectorAll('.wp-block-post');
        posts.forEach(post => glideSlides.appendChild(post));

        // Add arrow controls
        const glideArrows = document.createElement('div');
        glideArrows.classList.add('glide__arrows');
        glideArrows.setAttribute('data-glide-el', 'controls');
        slider.appendChild(glideArrows);

        const glideArrowLeft = document.createElement('button');
        glideArrowLeft.classList.add('glide__arrow', 'glide__arrow--left');
        glideArrowLeft.setAttribute('data-glide-dir', '<');
        glideArrowLeft.innerText = 'Prev';
        glideArrows.appendChild(glideArrowLeft);

        const glideArrowRight = document.createElement('button');
        glideArrowRight.classList.add('glide__arrow', 'glide__arrow--right');
        glideArrowRight.setAttribute('data-glide-dir', '>');
        glideArrowRight.innerText = 'Next';
        glideArrows.appendChild(glideArrowRight);

        // Add bullet navigation
        const glideBullets = document.createElement('div');
        glideBullets.classList.add('glide__bullets');
        glideBullets.setAttribute('data-glide-el', 'controls[nav]');
        slider.appendChild(glideBullets);

        posts.forEach((post, index) => {
            const glideBullet = document.createElement('button');
            glideBullet.classList.add('glide__bullet');
            glideBullet.setAttribute('data-glide-dir', `=${index}`);
            glideBullets.appendChild(glideBullet);
        });

        // Glide slider options
        const glideOptions = {
            type: 'slider',
            startAt: 0,
            perView: columns,
            gap: 20,
            rewind: false,
            bound: true,
            peek: { before: 0, after: 0 },
            breakpoints: {
                1700: { perView: Math.min(5, columns) },
                1450: { perView: Math.min(4, columns) },
                1150: { perView: Math.min(3, columns) },
                850: { perView: Math.min(2, columns) },
                550: { perView: Math.min(1.5, columns), peek: { before: 0, after: 0 } },
                400: { perView: 1, peek: { before: 0, after: 0 } }
            }
        };

        // Tweak spacing if using full-width layout
        if (slider.classList.contains('alignfull')) {
            glideOptions.peek = { before: 0, after: 50 };
        }

        new Glide(slider, glideOptions).mount();
    });
});
