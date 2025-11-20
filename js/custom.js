(function ($) {

    "use strict";

        // PRE LOADER
        $(window).load(function(){
          $('.preloader').fadeOut(1000); // set duration in brackets    
        });


        // navigation Section
        $('.navbar-collapse a').on('click',function(){
          $(".navbar-collapse").collapse('hide');
        });


        // Parallax Js
        function initParallax() {
          $('#home').parallax("50%", 50);
          $('#service').parallax("50%", 40);
          $('#about').parallax("50%", 20);
          $('#work').parallax("50%", 30);
          $('#contact').parallax("50%", 10);
          }
        initParallax();
        

        // smoothscroll js
        $(function() {
          $('#home a').bind('click', function(event) {
            var $anchor = $(this);
            $('html, body').stop().animate({
                scrollTop: $($anchor.attr('href')).offset().top - 49
            }, 1000);
            event.preventDefault();
          });
        });  


        // WOW Animation js
        new WOW({ mobile: false }).init();

        // Contact Form Handler
        $('#contact-form').on('submit', function(e) {
          e.preventDefault(); // Previne o envio padrão do formulário
          
          // Limpa o formulário
          this.reset();
          
          // Mostra o modal de sucesso
          $('#contact-success-modal').fadeIn(300);
          $('body').css('overflow', 'hidden'); // Previne scroll do body quando modal está aberto
        });

        // Fecha o modal quando clicar no X
        $('.contact-modal-close, #contact-success-modal').on('click', function(e) {
          if (e.target === this) {
            $('#contact-success-modal').fadeOut(300);
            $('body').css('overflow', 'auto'); // Restaura scroll do body
          }
        });

        // Previne fechamento do modal ao clicar no conteúdo
        $('.contact-modal-content').on('click', function(e) {
          e.stopPropagation();
        });

})(jQuery);
