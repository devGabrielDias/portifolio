(function() {
    'use strict';

    $(document).ready(function() {
        const swiper = new Swiper('.projects-slider', {
            slidesPerView: 1,
            spaceBetween: 40,
            loop: true,
            centeredSlides: true,
            autoplay: {
                delay: 5000,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        });

        let serviceSwiper = null;
        const serviceSwiperElement = document.querySelector('.service-swiper');
        if (serviceSwiperElement) {
            setTimeout(function() {
                serviceSwiper = new Swiper(serviceSwiperElement, {
                    slidesPerView: 1,
                    spaceBetween: 30,
                    loop: true,
                    centeredSlides: true,
                    autoplay: {
                        delay: 4000,
                        disableOnInteraction: false,
                    },
                    pagination: {
                        el: serviceSwiperElement.querySelector('.swiper-pagination'),
                        clickable: true,
                        dynamicBullets: true,
                    },
                    navigation: {
                        nextEl: serviceSwiperElement.querySelector('.swiper-button-next'),
                        prevEl: serviceSwiperElement.querySelector('.swiper-button-prev'),
                    },
                });
            }, 100);

            $(window).on('resize', function() {
                if (serviceSwiper) {
                    serviceSwiper.update();
                }
            });
        }

        const aboutText = document.querySelector('.about-text');
        const aboutReadMoreBtn = document.querySelector('.about-read-more-btn');
        const aboutReadMoreText = document.querySelector('.about-read-more-text');
        const aboutReadLessText = document.querySelector('.about-read-less-text');

        if (aboutText && aboutReadMoreBtn) {
            let isAboutExpanded = false;

            function checkAboutTextHeight() {
                if (window.innerWidth <= 768) {
                    aboutText.classList.remove('truncated', 'expanded');
                    const textHeight = aboutText.scrollHeight;
                    const maxHeight = 200;

                    if (textHeight > maxHeight && !isAboutExpanded) {
                        aboutText.classList.add('truncated');
                        aboutReadMoreBtn.style.display = 'block';
                        aboutReadMoreText.style.display = 'inline';
                        aboutReadLessText.style.display = 'none';
                    } else if (!isAboutExpanded) {
                        aboutText.classList.add('truncated');
                        aboutReadMoreBtn.style.display = 'block';
                    }
                } else {
                    aboutText.classList.remove('truncated', 'expanded');
                    aboutReadMoreBtn.style.display = 'none';
                    isAboutExpanded = false;
                }
            }

            setTimeout(function() {
                checkAboutTextHeight();
            }, 100);

            $(window).on('resize', function() {
                if (window.innerWidth <= 768 && !isAboutExpanded) {
                    checkAboutTextHeight();
                } else if (window.innerWidth > 768) {
                    isAboutExpanded = false;
                    checkAboutTextHeight();
                }
            });

            aboutReadMoreBtn.addEventListener('click', function() {
                if (isAboutExpanded) {
                    aboutText.classList.remove('expanded');
                    aboutText.classList.add('truncated');
                    aboutReadMoreText.style.display = 'inline';
                    aboutReadLessText.style.display = 'none';
                    isAboutExpanded = false;
                } else {
                    aboutText.classList.remove('truncated');
                    aboutText.classList.add('expanded');
                    aboutReadMoreText.style.display = 'none';
                    aboutReadLessText.style.display = 'inline';
                    isAboutExpanded = true;
                }
            });
        }
    });

    (function() {
        const carousel = document.getElementById('vertical-thumbnails');
        if (!carousel) return;

        const slides = carousel.querySelectorAll('.carousel-slide');
        const paginationItems = carousel.querySelectorAll('.carousel-pagination-item');
        const prevButton = carousel.querySelector('.carousel-prev');
        const nextButton = carousel.querySelector('.carousel-next');
        const descriptionTitle = carousel.querySelector('.carousel-description-title');
        const descriptionText = carousel.querySelector('.carousel-description-text');
        const readMoreBtn = carousel.querySelector('.carousel-read-more-btn');
        const readMoreText = carousel.querySelector('.read-more-text');
        const readLessText = carousel.querySelector('.read-less-text');

        let currentSlide = 0;
        const totalSlides = slides.length;
        const maxChars = 200;
        let fullDescription = '';
        let isExpanded = false;

        function truncateText(text, maxLength) {
            if (text.length <= maxLength) return text;
            let truncated = text.substr(0, maxLength);
            let lastSpace = truncated.lastIndexOf(' ');
            if (lastSpace > 0) {
                truncated = truncated.substr(0, lastSpace);
            }
            return truncated + '...';
        }

        function updateDescription(slide) {
            if (slide && descriptionTitle && descriptionText) {
                const title = slide.getAttribute('data-title') || 'Título do Projeto';
                let description = slide.getAttribute('data-description') || 'Descrição do projeto aparecerá aqui.';

                descriptionTitle.textContent = title;

                description = description.trim();
                const paragraphs = description.split(/\n\s*\n/).filter(p => p.trim().length > 0);

                if (paragraphs.length === 0) {
                    paragraphs.push(description);
                }

                fullDescription = paragraphs.map(p => `<p>${p.trim()}</p>`).join('');

                const totalLength = description.length;
                if (totalLength > maxChars) {
                    let truncatedText = '';
                    let currentLength = 0;

                    for (let i = 0; i < paragraphs.length; i++) {
                        const para = paragraphs[i].trim();
                        if (currentLength + para.length <= maxChars) {
                            truncatedText += `<p>${para}</p>`;
                            currentLength += para.length + 2;
                        } else {
                            const remaining = maxChars - currentLength;
                            if (remaining > 50) {
                                const truncatedPara = truncateText(para, remaining);
                                truncatedText += `<p>${truncatedPara}</p>`;
                            }
                            break;
                        }
                    }

                    descriptionText.innerHTML = truncatedText;
                    descriptionText.classList.add('truncated');
                    if (readMoreBtn) {
                        readMoreBtn.style.display = 'block';
                        readMoreText.style.display = 'inline';
                        readLessText.style.display = 'none';
                    }
                    isExpanded = false;
                } else {
                    descriptionText.innerHTML = fullDescription;
                    descriptionText.classList.remove('truncated');
                    if (readMoreBtn) {
                        readMoreBtn.style.display = 'none';
                    }
                    isExpanded = true;
                }
            }
        }

        if (readMoreBtn) {
            readMoreBtn.addEventListener('click', function() {
                if (isExpanded) {
                    updateDescription(slides[currentSlide]);
                } else {
                    descriptionText.innerHTML = fullDescription;
                    descriptionText.classList.remove('truncated');
                    readMoreText.style.display = 'none';
                    readLessText.style.display = 'inline';
                    isExpanded = true;
                }
            });
        }

        function showSlide(index) {
            slides.forEach(slide => slide.classList.remove('active'));
            paginationItems.forEach(item => item.classList.remove('active'));

            if (slides[index]) {
                slides[index].classList.add('active');
                updateDescription(slides[index]);
            }
            if (paginationItems[index]) {
                paginationItems[index].classList.add('active');
            }

            if (prevButton) {
                prevButton.disabled = index === 0;
            }
            if (nextButton) {
                nextButton.disabled = index === totalSlides - 1;
            }
        }

        function nextSlide() {
            if (currentSlide < totalSlides - 1) {
                currentSlide++;
                showSlide(currentSlide);
            }
        }

        function prevSlide() {
            if (currentSlide > 0) {
                currentSlide--;
                showSlide(currentSlide);
            }
        }

        if (nextButton) {
            nextButton.addEventListener('click', nextSlide);
        }
        if (prevButton) {
            prevButton.addEventListener('click', prevSlide);
        }

        paginationItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                currentSlide = index;
                showSlide(currentSlide);
            });
        });

        showSlide(0);

        if (slides[0]) {
            updateDescription(slides[0]);
        }
    })();

    (function() {
        const CHAT_ENDPOINT = "https://webhook.agentelegtech.pro/webhook/portifolio-chat";

        let sessionId = localStorage.getItem("gt_portfolio_session_id");
        if (!sessionId) {
            sessionId = "sess-" + Math.random().toString(36).substring(2, 9) + Date.now();
            localStorage.setItem("gt_portfolio_session_id", sessionId);
        }

        const chatBubbleContainer = document.getElementById("gt-chat-bubble-container");
        const chatBubble = document.getElementById("gt-chat-bubble");
        const chatWidget = document.getElementById("gt-chat-widget");
        const chatClose = document.getElementById("gt-chat-close");
        const chatMessages = document.getElementById("gt-chat-messages");
        const chatForm = document.getElementById("gt-chat-form");
        const chatInput = document.getElementById("gt-chat-input");

        if (chatBubbleContainer && window.innerWidth > 768) {
            chatBubbleContainer.classList.remove("hidden");
        }

        if (chatBubble && chatWidget) {
            chatBubble.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                chatWidget.style.display = "flex";
                if (chatBubbleContainer) {
                    chatBubbleContainer.classList.add("hidden");
                }
            });
        }

        if (chatClose) {
            chatClose.addEventListener("click", (e) => {
                e.preventDefault();
                e.stopPropagation();
                if (chatWidget) {
                    chatWidget.style.display = "none";
                }
                if (chatBubbleContainer && window.innerWidth > 768) {
                    chatBubbleContainer.classList.remove("hidden");
                }
            });
        }

        function appendMessage(role, text) {
            const div = document.createElement("div");
            div.classList.add("gt-chat-message", role === "user" ? "user" : "bot");
            div.textContent = text;
            chatMessages.appendChild(div);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        function showTyping() {
            const typing = document.createElement("div");
            typing.id = "gt-typing";
            typing.classList.add("gt-typing");
            typing.textContent = "Agente digitando...";
            chatMessages.appendChild(typing);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        function hideTyping() {
            const el = document.getElementById("gt-typing");
            if (el) el.remove();
        }

        chatForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const text = chatInput.value.trim();
            if (!text) return;

            appendMessage("user", text);
            chatInput.value = "";
            showTyping();

            try {
                const res = await fetch(CHAT_ENDPOINT, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        sessionId: sessionId,
                        message: text
                    })
                });

                const data = await res.json();
                hideTyping();

                appendMessage("bot", data.reply || "Erro ao processar a mensagem.");
            } catch (err) {
                hideTyping();
                appendMessage("bot", "Falha ao conectar com o servidor.");
                console.error(err);
            }
        });
    })();

    (function() {
        const CHAT_ENDPOINT = "https://n8n.agentelegtech.pro/webhook/portifolio-chat";

        let sessionId = localStorage.getItem("gt_portfolio_session_id");
        if (!sessionId) {
            sessionId = "sess-" + Math.random().toString(36).substring(2, 9) + Date.now();
            localStorage.setItem("gt_portfolio_session_id", sessionId);
        }

        const chatMobileMessages = document.getElementById("gt-chat-mobile-messages");
        const chatMobileForm = document.getElementById("gt-chat-mobile-form");
        const chatMobileInput = document.getElementById("gt-chat-mobile-input");

        if (!chatMobileMessages || !chatMobileForm || !chatMobileInput) return;

        function appendMessage(role, text) {
            const div = document.createElement("div");
            div.classList.add("gt-chat-message", role === "user" ? "user" : "bot");
            div.textContent = text;
            chatMobileMessages.appendChild(div);
            chatMobileMessages.scrollTop = chatMobileMessages.scrollHeight;
        }

        function showTyping() {
            const typing = document.createElement("div");
            typing.id = "gt-typing-mobile";
            typing.classList.add("gt-typing");
            typing.textContent = "Agente digitando...";
            chatMobileMessages.appendChild(typing);
            chatMobileMessages.scrollTop = chatMobileMessages.scrollHeight;
        }

        function hideTyping() {
            const el = document.getElementById("gt-typing-mobile");
            if (el) el.remove();
        }

        chatMobileForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            const text = chatMobileInput.value.trim();
            if (!text) return;

            appendMessage("user", text);
            chatMobileInput.value = "";
            showTyping();

            try {
                const res = await fetch(CHAT_ENDPOINT, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        sessionId: sessionId,
                        message: text
                    })
                });

                const data = await res.json();
                hideTyping();

                appendMessage("bot", data.reply || "Erro ao processar a mensagem.");
            } catch (err) {
                hideTyping();
                appendMessage("bot", "Falha ao conectar com o servidor.");
                console.error(err);
            }
        });
    })();
})();

