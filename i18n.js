// i18n.js — language switcher (PT · EN · ES) for the Di Maré guest guide.
// Flags at top-right swap every translatable string in place. Choice persists.
// Runs AFTER app.js so dynamically-added buttons (e.g. "Índice") are captured.
(() => {
  'use strict';

  // ── Block-level elements (two-line titles with <br>) translated whole ──
  // textContent loses the <br> separator, so key by innerHTML with <br>→space.
  const BLOCK = {
    // section titles
    'Seja muito bem-vindo(a)!':   { en: 'A very warm<br/>welcome!',        es: '¡Una calurosa<br/>bienvenida!' },
    'Recepção e acesso.':         { en: 'Reception<br/>&amp; access.',     es: 'Recepción<br/>y acceso.' },
    'Garagem e energia.':         { en: 'Garage<br/>&amp; power.',         es: 'Garaje<br/>y energía.' },
    'O seu flat 201.':            { en: 'Your<br/>flat 201.',              es: 'Tu<br/>flat 201.' },
    'O seu flat 202.':            { en: 'Your<br/>flat 202.',              es: 'Tu<br/>flat 202.' },
    'O seu flat 301.':            { en: 'Your<br/>flat 301.',              es: 'Tu<br/>flat 301.' },
    'Seu apartamento.':           { en: 'Your<br/>apartment.',            es: 'Tu<br/>apartamento.' },
    'Guia da casa.':              { en: 'House<br/>guide.',                es: 'Guía<br/>de la casa.' },
    'Comodidades &amp; serviços.':{ en: 'Amenities<br/>&amp; services.',  es: 'Comodidades<br/>y servicios.' },
    'Regras da casa.':            { en: 'House<br/>rules.',                es: 'Normas<br/>de la casa.' },
    'Antes de ir embora.':        { en: 'Before<br/>you leave.',          es: 'Antes de<br/>marcharte.' },
    'Localização &amp; região.':  { en: 'Location<br/>&amp; area.',       es: 'Ubicación<br/>y zona.' },
    'O que fazer em Porto.':      { en: 'What to do<br/>in Porto.',        es: 'Qué hacer<br/>en Porto.' },
    'Onde comer em Porto.':       { en: 'Where to eat<br/>in Porto.',      es: 'Dónde comer<br/>en Porto.' },
    'Opções veganas.':            { en: 'Vegan<br/>options.',             es: 'Opciones<br/>veganas.' },
    // h-section (sumário)
    'O que você vai encontrar aqui.': { en: "What you'll<br/>find here.", es: 'Lo que vas a<br/>encontrar aquí.' },
    // thanks title
    'Tenha uma ótima estadia!':   { en: 'Have a<br/>wonderful stay!',     es: '¡Que tengas una<br/>excelente estancia!' },
    // cover stamp
    'Bem- vindo!':                { en: 'Wel-<br/>come!',                  es: '¡Bien-<br/>venido!' },
  };

  // ── Plain text-node strings (keyed by collapsed PT text) ───────────────
  const T = {
    // cover
    'Guia do hóspede': { en: 'Guest guide', es: 'Guía del huésped' },
    'Sua experiência em Porto de Galinhas começa aqui.': { en: 'Your experience in Porto de Galinhas starts here.', es: 'Tu experiencia en Porto de Galinhas comienza aquí.' },
    'Localização': { en: 'Location', es: 'Ubicación' },
    'a partir das 14h': { en: 'from 2:00 PM', es: 'a partir de las 14h' },
    'até às 11h': { en: 'until 11:00 AM', es: 'hasta las 11h' },

    // sumário
    'índice': { en: 'contents', es: 'contenido' },
    'Tudo o que você precisa para uma estadia tranquila. Toque em qualquer item para ir direto.': { en: 'Everything you need for a peaceful stay. Tap any item to jump straight there.', es: 'Todo lo que necesitas para una estancia tranquila. Toca cualquier elemento para ir directo.' },
    'Boas-vindas': { en: 'Welcome', es: 'Bienvenida' },
    'Recepção & Acesso': { en: 'Reception & Access', es: 'Recepción y Acceso' },
    'Garagem & Energia': { en: 'Garage & Power', es: 'Garaje y Energía' },
    'Seu Flat · 201': { en: 'Your Flat · 201', es: 'Tu Flat · 201' },
    'Seu Flat · 202': { en: 'Your Flat · 202', es: 'Tu Flat · 202' },
    'Seu Flat · 301': { en: 'Your Flat · 301', es: 'Tu Flat · 301' },
    'Seu Apartamento': { en: 'Your Apartment', es: 'Tu Apartamento' },
    'Guia da Casa': { en: 'House Guide', es: 'Guía de la Casa' },
    'Comodidades': { en: 'Amenities', es: 'Comodidades' },
    'Regras da Casa': { en: 'House Rules', es: 'Normas de la Casa' },
    'Localização': { en: 'Location', es: 'Ubicación' },
    'O que Fazer': { en: 'What to Do', es: 'Qué Hacer' },
    'Onde Comer': { en: 'Where to Eat', es: 'Dónde Comer' },
    'Opções Veganas': { en: 'Vegan Options', es: 'Opciones Veganas' },
    'Obrigado!': { en: 'Thank you!', es: '¡Gracias!' },
    'Boa estadia!': { en: 'Enjoy your stay!', es: '¡Buena estancia!' },
    'Qualquer dúvida durante a hospedagem, conte com o anfitrião.': { en: 'Any questions during your stay, count on your host.', es: 'Cualquier duda durante la estancia, cuenta con el anfitrión.' },
    'Falar com o anfitrião': { en: 'Message the host', es: 'Hablar con el anfitrión' },
    'Índice': { en: 'Contents', es: 'Índice' },

    // boas-vindas
    'Olá! 😊': { en: 'Hello! 😊', es: '¡Hola! 😊' },
    'É um prazer recebê-lo(a) em nossa acomodação, e espero que sua estadia seja maravilhosa desde o primeiro instante!': { en: "It's a pleasure to host you, and I hope your stay is wonderful from the very first moment!", es: '¡Es un placer recibirte en nuestro alojamiento y espero que tu estancia sea maravillosa desde el primer instante!' },
    'Assim que possível, dê uma olhadinha geral no apartamento para verificar se está tudo certo: limpeza, itens disponíveis, estrutura.': { en: 'As soon as you can, take a general look around the apartment to check everything is in order: cleanliness, available items, structure.', es: 'En cuanto puedas, echa un vistazo general al apartamento para verificar que todo esté bien: limpieza, artículos disponibles, estructura.' },
    'Caso note qualquer detalhe que não esteja conforme estabelecido na plataforma, ou tenha qualquer dúvida,': { en: "If you notice any detail that isn't as described on the platform, or have any questions,", es: 'Si notas algún detalle que no esté conforme a lo establecido en la plataforma, o tienes alguna duda,' },
    'me envie uma mensagem': { en: 'send me a message', es: 'envíame un mensaje' },
    '. Estarei à disposição para resolver prontamente e garantir o seu conforto e bem-estar. Conte comigo durante toda a sua estadia!': { en: ". I'll be available to resolve it promptly and ensure your comfort and well-being. Count on me throughout your stay!", es: '. Estaré a disposición para resolverlo de inmediato y garantizar tu comodidad y bienestar. ¡Cuenta conmigo durante toda tu estancia!' },
    'Um excelente início de hospedagem!': { en: 'A wonderful start to your stay!', es: '¡Un excelente comienzo de estancia!' },

    // recepção & acesso
    '1 · Acesso com porteiro': { en: '1 · Access with doorman', es: '1 · Acceso con portero' },
    'Seu acesso será feito com o auxílio do porteiro na recepção das': { en: 'Your access will be assisted by the doorman at reception from', es: 'Tu acceso se hará con la ayuda del portero en recepción de' },
    '9h à 0h': { en: '9 AM to midnight', es: '9h a 0h' },
    'e das': { en: 'and from', es: 'y de' },
    '1h às 3h': { en: '1 AM to 3 AM', es: '1h a 3h' },
    '. Caso o porteiro não esteja presente, siga as instruções de acesso sem porteiro abaixo.': { en: ". If the doorman isn't present, follow the no-doorman access instructions below.", es: '. Si el portero no está presente, sigue las instrucciones de acceso sin portero a continuación.' },
    '2 · Acesso sem porteiro': { en: '2 · Access without doorman', es: '2 · Acceso sin portero' },
    'SENHA DA RECEPÇÃO': { en: 'RECEPTION CODE', es: 'CLAVE DE RECEPCIÓN' },
    'Copiar código': { en: 'Copy code', es: 'Copiar código' },
    'No display do porteiro eletrônico, com a mão já na maçaneta, pressione a tecla': { en: 'On the intercom display, with your hand already on the handle, press the key', es: 'En la pantalla del portero electrónico, con la mano ya en la manija, pulsa la tecla' },
    'Digite o código': { en: 'Enter the code', es: 'Introduce el código' },
    'Um sinal luminoso': { en: 'A', es: 'Una luz' },
    'verde': { en: 'green', es: 'verde' },
    'acenderá.': { en: 'light will come on.', es: 'se encenderá.' },
    'Assim que a luz verde acender,': { en: 'As soon as the green light comes on,', es: 'En cuanto se encienda la luz verde,' },
    'puxe imediatamente': { en: 'immediately pull', es: 'tira de inmediato' },
    'a maçaneta para abrir.': { en: 'the handle to open.', es: 'de la manija para abrir.' },
    'O sistema de segurança fecha automaticamente em poucos segundos — a abertura deve ser rápida após o sinal verde. Este mesmo procedimento também pode ser usado pela': { en: 'The security system locks automatically within a few seconds — opening must be quick after the green signal. This same procedure can also be used from', es: 'El sistema de seguridad se cierra automáticamente en pocos segundos — la apertura debe ser rápida tras la señal verde. Este mismo procedimiento también puede usarse por la' },

    // garagem & energia
    'Garagem · 18 vagas rotativas': { en: 'Garage · 18 rotating spaces', es: 'Garaje · 18 plazas rotativas' },
    'Acesso pela': { en: 'Access via', es: 'Acceso por la' },
    '. Utilize as vagas livres disponíveis, sem custo. No primeiro acesso, o porteiro pode auxiliar — caso esteja ausente, o': { en: '. Use any available free spaces, at no cost. On your first visit, the doorman can help — if absent, the', es: '. Usa las plazas libres disponibles, sin costo. En el primer acceso, el portero puede ayudar — si está ausente, el' },
    'controle remoto do portão': { en: 'gate remote control', es: 'control remoto del portón' },
    'está na prateleira do flat.': { en: "is on the flat's shelf.", es: 'está en el estante del flat.' },
    'Ao sair, o portão se fecha automaticamente': { en: 'When leaving, the gate closes automatically', es: 'Al salir, el portón se cierra automáticamente' },
    '40 segundos': { en: '40 seconds', es: '40 segundos' },
    'após o acionamento.': { en: 'after activation.', es: 'tras la activación.' },
    'Economizador de energia': { en: 'Energy saver', es: 'Ahorrador de energía' },
    'Este flat possui economizador de energia. Para que a energia funcione normalmente, é necessário': { en: 'This flat has an energy saver. For the power to work normally, you must', es: 'Este flat tiene un ahorrador de energía. Para que la energía funcione normalmente, es necesario' },
    'acionar o botão': { en: 'press the button', es: 'accionar el botón' },
    'localizado próximo ao interruptor na entrada,': { en: 'located near the switch at the entrance,', es: 'ubicado cerca del interruptor en la entrada,' },
    'sempre que a porta do apartamento for fechada': { en: 'whenever the apartment door is closed', es: 'siempre que la puerta del apartamento se cierre' },
    'Se permanecer alguém dentro do flat, acione novamente o botão para a energia continuar funcionando.': { en: 'If someone stays inside the flat, press the button again so the power keeps working.', es: 'Si alguien permanece dentro del flat, acciona de nuevo el botón para que la energía siga funcionando.' },

    // flats
    'Informações exclusivas da sua unidade — rede Wi-Fi, senha da fechadura e detalhes do apartamento.': { en: 'Exclusive information for your unit — Wi-Fi network, lock code and apartment details.', es: 'Información exclusiva de tu unidad — red Wi-Fi, clave de la cerradura y detalles del apartamento.' },
    'Apartamento': { en: 'Apartment', es: 'Apartamento' },
    '1º andar': { en: '1st floor', es: '1º piso' },
    '2º andar': { en: '2nd floor', es: '2º piso' },
    'REDE': { en: 'NETWORK', es: 'RED' },
    'SENHA': { en: 'PASSWORD', es: 'CONTRASEÑA' },
    'Copiar': { en: 'Copy', es: 'Copiar' },
    'Senha da fechadura / cadeado': { en: 'Lock / padlock code', es: 'Clave de la cerradura / candado' },
    '2 ar-condicionados': { en: '2 air conditioners', es: '2 aires acondicionados' },
    '3 ventiladores de teto': { en: '3 ceiling fans', es: '3 ventiladores de techo' },
    '2 colchões de mola': { en: '2 spring mattresses', es: '2 colchones de muelles' },
    'Senha da recepção (acesso ao prédio):': { en: 'Reception code (building access):', es: 'Clave de recepción (acceso al edificio):' },
    '— passo a passo na pág. 04.': { en: '— step by step on p. 04.', es: '— paso a paso en la pág. 04.' },
    '(quarto e sala) ·': { en: '(bedroom and living room) ·', es: '(habitación y sala) ·' },
    '2 ventiladores': { en: '2 fans', es: '2 ventiladores' },
    'com luminária na sala e no quarto.': { en: 'with a light in the living room and bedroom.', es: 'con luminaria en la sala y la habitación.' },
    'Forno elétrico': { en: 'Electric oven', es: 'Horno eléctrico' },
    'e': { en: 'and', es: 'y' },
    '3 ventiladores': { en: '3 fans', es: '3 ventiladores' },
    '(sala + quartos 1 e 2).': { en: '(living room + bedrooms 1 and 2).', es: '(sala + habitaciones 1 y 2).' },

    // seu apartamento
    'Todos os flats vêm equipados para uma estadia completa. Veja o que cada um oferece. 🔑': { en: 'All flats come equipped for a complete stay. See what each one offers. 🔑', es: 'Todos los flats vienen equipados para una estancia completa. Mira lo que ofrece cada uno. 🔑' },
    'Geladeira': { en: 'Refrigerator', es: 'Nevera' },
    'Fogão': { en: 'Stove', es: 'Cocina' },
    'Televisão': { en: 'Television', es: 'Televisión' },
    'Forno de microondas': { en: 'Microwave oven', es: 'Horno microondas' },
    'Sanduicheira': { en: 'Sandwich maker', es: 'Sandwichera' },
    'Liquidificador': { en: 'Blender', es: 'Licuadora' },
    'Secador de cabelo': { en: 'Hair dryer', es: 'Secador de pelo' },
    '2 Ar-condicionados': { en: '2 Air conditioners', es: '2 Aires acondicionados' },
    '3 Ventiladores de teto': { en: '3 Ceiling fans', es: '3 Ventiladores de techo' },
    '2 Colchões de mola': { en: '2 Spring mattresses', es: '2 Colchones de muelles' },
    'Ferro e tábua de passar': { en: 'Iron and ironing board', es: 'Plancha y tabla de planchar' },
    'Vassoura e rodo': { en: 'Broom and squeegee', es: 'Escoba y escurridor' },
    'Varal de chão': { en: 'Floor clothes rack', es: 'Tendedero de pie' },
    'Rede de descanso': { en: 'Hammock', es: 'Hamaca' },
    '2 Ar-condicionados (quarto e sala)': { en: '2 Air conditioners (bedroom and living room)', es: '2 Aires acondicionados (habitación y sala)' },
    '2 Ventiladores de teto com luminária (sala e quarto)': { en: '2 Ceiling fans with light (living room and bedroom)', es: '2 Ventiladores de techo con luminaria (sala y habitación)' },
    '2 Ar-condicionados (quartos 1 e 2)': { en: '2 Air conditioners (bedrooms 1 and 2)', es: '2 Aires acondicionados (habitaciones 1 y 2)' },
    '3 Ventiladores de teto com luminária (sala e quartos 1 e 2)': { en: '3 Ceiling fans with light (living room and bedrooms 1 and 2)', es: '3 Ventiladores de techo con luminaria (sala y habitaciones 1 y 2)' },
    '2 Colchões de molas ensacadas (quartos 1 e 2)': { en: '2 Pocket-spring mattresses (bedrooms 1 and 2)', es: '2 Colchones de muelles ensacados (habitaciones 1 y 2)' },

    // guia da casa
    '🌀 Ventilador de teto': { en: '🌀 Ceiling fan', es: '🌀 Ventilador de techo' },
    'Luz principal do ventilador — liga/desliga.': { en: "Fan's main light — on/off.", es: 'Luz principal del ventilador — encender/apagar.' },
    'Luz de LED — liga/desliga.': { en: 'LED light — on/off.', es: 'Luz LED — encender/apagar.' },
    'Inversão de rotação (ventilação ou exaustão).': { en: 'Rotation reversal (ventilation or exhaust).', es: 'Inversión de giro (ventilación o extracción).' },
    'Botão rotativo — regula a velocidade do vento.': { en: 'Rotary knob — adjusts the wind speed.', es: 'Botón giratorio — regula la velocidad del viento.' },
    '🗑️ Coleta de lixo': { en: '🗑️ Garbage collection', es: '🗑️ Recogida de basura' },
    'A zeladoria recolhe diariamente, das': { en: 'Housekeeping collects daily, from', es: 'La conserjería recoge diariamente, de' },
    '9h às 12h': { en: '9 AM to noon', es: '9h a 12h' },
    '. Coloque a': { en: '. Place the', es: '. Coloca la' },
    'placa de coleta': { en: 'collection sign', es: 'placa de recogida' },
    'na maçaneta externa dentro desse horário. Não é permitido deixar lixo na área externa — fora do horário, descarte no subsolo da garagem.': { en: "on the outer handle within that time. Leaving garbage in the outdoor area isn't allowed — outside these hours, dispose of it in the garage basement.", es: 'en la manija externa dentro de ese horario. No se permite dejar basura en el área externa — fuera del horario, deséchala en el sótano del garaje.' },
    '🔐 Fechadura travou?': { en: '🔐 Lock jammed?', es: '🔐 ¿Cerradura bloqueada?' },
    'Se a bateria da fechadura inteligente descarregar, use o': { en: "If the smart lock's battery runs out, use the", es: 'Si la batería de la cerradura inteligente se agota, usa el' },
    'cadeado ao lado da porta': { en: 'padlock beside the door', es: 'candado al lado de la puerta' },
    '. Dentro do cofre há pilhas (palito e moeda), uma chave e uma TAG.': { en: '. Inside the safe there are batteries (AAA and coin-cell), a key and a TAG.', es: '. Dentro de la caja fuerte hay pilas (AAA y de botón), una llave y un TAG.' },
    'Passo a passo da fechadura': { en: 'Lock step by step', es: 'Paso a paso de la cerradura' },
    'Abra o cadeado ao lado da porta.': { en: 'Open the padlock beside the door.', es: 'Abre el candado al lado de la puerta.' },
    'Pegue a chave e as pilhas no cofre.': { en: 'Take the key and batteries from the safe.', es: 'Toma la llave y las pilas de la caja fuerte.' },
    'Use a chave na parte inferior da fechadura.': { en: 'Use the key on the lower part of the lock.', es: 'Usa la llave en la parte inferior de la cerradura.' },
    'Por dentro, troque as pilhas para reativar.': { en: 'From inside, replace the batteries to reactivate.', es: 'Por dentro, cambia las pilas para reactivar.' },
    'Depois de resolver, devolva a chave e a TAG ao cofre, feche-o e embaralhe a senha.': { en: 'Once resolved, return the key and TAG to the safe, close it and scramble the code.', es: 'Una vez resuelto, devuelve la llave y el TAG a la caja fuerte, ciérrala y mezcla la clave.' },

    // comodidades
    'Troca de enxoval (cama e banho)': { en: 'Linen change (bed and bath)', es: 'Cambio de ropa de cama y baño' },
    'Válido apenas para estadias': { en: 'Valid only for stays', es: 'Válido solo para estancias' },
    'superiores a 5 dias': { en: 'longer than 5 days', es: 'superiores a 5 días' },
    'Solicitação via': { en: 'Request via', es: 'Solicitud mediante' },
    'agendamento': { en: 'scheduling', es: 'cita previa' },
    'com o anfitrião.': { en: 'with the host.', es: 'con el anfitrión.' },
    'Prazo mínimo:': { en: 'Minimum notice:', es: 'Plazo mínimo:' },
    '24h de antecedência': { en: '24h in advance', es: '24h de antelación' },
    'Devolução de itens': { en: 'Returning items', es: 'Devolución de artículos' },
    'Após utilizar qualquer item, devolva-o ao mesmo local em que foi encontrado, para que fique organizado para os próximos hóspedes. 🙏': { en: 'After using any item, return it to the same place you found it, so it stays organized for the next guests. 🙏', es: 'Después de usar cualquier artículo, devuélvelo al mismo lugar donde lo encontraste, para que quede organizado para los próximos huéspedes. 🙏' },
    'fique à vontade!': { en: 'make yourself at home!', es: '¡siéntete como en casa!' },

    // regras
    'Regrinhas importantes para o bem-estar de todos. ♡': { en: 'A few important rules for everyone\u2019s well-being. ♡', es: 'Unas normas importantes para el bienestar de todos. ♡' },
    '🐶 Pets': { en: '🐶 Pets', es: '🐶 Mascotas' },
    'Não são permitidos.': { en: 'Not allowed.', es: 'No se permiten.' },
    '🔊 Som alto': { en: '🔊 Loud sound', es: '🔊 Sonido alto' },
    'Proibido no apê e áreas comuns, inclusive a piscina.': { en: 'Forbidden in the flat and common areas, including the pool.', es: 'Prohibido en el flat y áreas comunes, incluida la piscina.' },
    '🥂 Vidro no rooftop': { en: '🥂 Glass on the rooftop', es: '🥂 Vidrio en el rooftop' },
    'Use copos de plástico ou acrílico no rooftop.': { en: 'Use plastic or acrylic cups on the rooftop.', es: 'Usa vasos de plástico o acrílico en el rooftop.' },
    '🚫 Visitas / festas': { en: '🚫 Visitors / parties', es: '🚫 Visitas / fiestas' },
    'Visitas, festas ou eventos não são autorizados.': { en: 'Visitors, parties or events are not allowed.', es: 'No se autorizan visitas, fiestas ni eventos.' },
    '🏊 Piscina': { en: '🏊 Pool', es: '🏊 Piscina' },
    'Disponível das 8h às 21h.': { en: 'Open from 8 AM to 9 PM.', es: 'Disponible de 8h a 21h.' },
    '🔥 Churrasqueira': { en: '🔥 Barbecue', es: '🔥 Parrilla' },
    'Permitida com agendamento prévio na recepção.': { en: 'Allowed with prior booking at reception.', es: 'Permitida con reserva previa en recepción.' },
    '🪑 Mesas do rooftop': { en: '🪑 Rooftop tables', es: '🪑 Mesas del rooftop' },
    'Podem ser usadas após as 21h, mas sem barulho.': { en: 'May be used after 9 PM, but quietly.', es: 'Pueden usarse después de las 21h, pero sin ruido.' },
    '🚬 Fumar': { en: '🚬 Smoking', es: '🚬 Fumar' },
    'Apenas na varanda ou janelas, com respeito aos vizinhos.': { en: 'Only on the balcony or by windows, respecting neighbors.', es: 'Solo en el balcón o ventanas, respetando a los vecinos.' },

    // check-out
    'Para facilitar a finalização da sua hospedagem, peço a gentileza de:': { en: 'To make wrapping up your stay easier, please kindly:', es: 'Para facilitar el cierre de tu estancia, te pido amablemente:' },
    'Toalhas usadas': { en: 'Used towels', es: 'Toallas usadas' },
    '— sobre o tampo da bacia sanitária.': { en: '— on top of the toilet lid.', es: '— sobre la tapa del inodoro.' },
    'Cadeiras de praia': { en: 'Beach chairs', es: 'Sillas de playa' },
    '— devolva limpas no suporte suspenso.': { en: '— return them clean on the hanging rack.', es: '— devuélvelas limpias en el soporte colgante.' },
    'Esquadrias e cortinas': { en: 'Windows and curtains', es: 'Ventanas y cortinas' },
    '— feche tudo e mantenha as cortinas fechadas.': { en: '— close everything and keep the curtains closed.', es: '— ciérralo todo y mantén las cortinas cerradas.' },
    'Utensílios de cozinha': { en: 'Kitchen utensils', es: 'Utensilios de cocina' },
    '— deixe lavados.': { en: '— leave them washed.', es: '— déjalos lavados.' },
    'Lixo': { en: 'Garbage', es: 'Basura' },
    '— entregue à colaboradora ou deixe no balde do subsolo.': { en: '— hand it to the staff or leave it in the basement bin.', es: '— entrégala a la colaboradora o déjala en el cubo del sótano.' },
    'Controle da garagem': { en: 'Garage remote', es: 'Control del garaje' },
    '— deixe na prateleira da sala.': { en: '— leave it on the living-room shelf.', es: '— déjalo en el estante de la sala.' },
    'Porta': { en: 'Door', es: 'Puerta' },
    '— certifique-se de que foi bem fechada, e me avise ao sair.': { en: '— make sure it is properly closed, and let me know when you leave.', es: '— asegúrate de que quede bien cerrada y avísame al salir.' },
    '⚠️ Observação importante — Toalhas': { en: '⚠️ Important note — Towels', es: '⚠️ Observación importante — Toallas' },
    'As toalhas molhadas': { en: 'Wet towels', es: 'Las toallas mojadas' },
    'jamais devem ser deixadas penduradas no box do banho': { en: 'must never be left hanging in the shower box', es: 'jamás deben dejarse colgadas en la mampara de la ducha' },
    '— isso pode danificar a estrutura e gerar prejuízo ao hóspede. Deixe-as': { en: '— this can damage the structure and cause loss to the guest. Leave them', es: '— esto puede dañar la estructura y causar perjuicio al huésped. Déjalas' },
    'exclusivamente sobre o tampo do vaso sanitário': { en: 'exclusively on top of the toilet lid', es: 'exclusivamente sobre la tapa del inodoro' },

    // localização
    'é um distrito de Ipojuca, PE, a': { en: 'is a district of Ipojuca, PE,', es: 'es un distrito de Ipojuca, PE, a' },
    '60 km de Recife': { en: '60 km from Recife', es: '60 km de Recife' },
    '. É uma vila diurna — os estabelecimentos funcionam geralmente das': { en: ". It's a daytime village — businesses generally operate from", es: '. Es un pueblo diurno — los establecimientos funcionan generalmente de' },
    '11h às 23h': { en: '11 AM to 11 PM', es: '11h a 23h' },
    'Di Maré Residence — você está aqui': { en: 'Di Maré Residence — you are here', es: 'Di Maré Residence — estás aquí' },
    'Rua das Sombrinhas': { en: 'Rua das Sombrinhas', es: 'Rua das Sombrinhas' },
    'Sombrinhas coloridas, comércio e gastronomia.': { en: 'Colorful parasols, shops and dining.', es: 'Sombrillas coloridas, comercio y gastronomía.' },
    'Praça e Calçadão': { en: 'Square & Boardwalk', es: 'Plaza y Paseo' },
    'Feirinha e acesso às piscinas naturais.': { en: 'Craft market and access to the natural pools.', es: 'Mercadillo y acceso a las piscinas naturales.' },
    'Caixas 24h': { en: '24h ATMs', es: 'Cajeros 24h' },
    'Saques na região central.': { en: 'Cash withdrawals in the central area.', es: 'Retiros en la zona central.' },
    'Supermercados': { en: 'Supermarkets', es: 'Supermercados' },
    'Abastecimento no centro de Porto.': { en: 'Groceries in the center of Porto.', es: 'Abastecimiento en el centro de Porto.' },

    // o que fazer
    '⭐ IMPERDÍVEL': { en: '⭐ MUST-DO', es: '⭐ IMPERDIBLE' },
    '🛶 Passeio de Jangada': { en: '🛶 Raft Tour', es: '🛶 Paseo en Balsa' },
    'Água mansa, morna e cristalina, peixinhos coloridos e corais. Cenário de cartão-postal.': { en: 'Calm, warm, crystal-clear water, colorful fish and corals. A postcard scene.', es: 'Agua mansa, cálida y cristalina, pececillos coloridos y corales. Un escenario de postal.' },
    '🚙 Passeio de Buggy': { en: '🚙 Buggy Tour', es: '🚙 Paseo en Buggy' },
    'Tour pelas praias: Pontal de Maracaípe, Maracaípe, Cupe e Muro Alto.': { en: 'Tour of the beaches: Pontal de Maracaípe, Maracaípe, Cupe and Muro Alto.', es: 'Recorrido por las playas: Pontal de Maracaípe, Maracaípe, Cupe y Muro Alto.' },
    '🤿 Mergulho com Cilindro': { en: '🤿 Scuba Diving', es: '🤿 Buceo con Botella' },
    'Para os aventureiros. Em média, 30 minutos de mergulho.': { en: 'For the adventurous. About 30 minutes of diving on average.', es: 'Para los aventureros. En promedio, 30 minutos de buceo.' },
    '🏘️ Centro da Vila': { en: '🏘️ Village Center', es: '🏘️ Centro del Pueblo' },
    'Restaurantes, bares com música ao vivo e feirinha de artesanato.': { en: 'Restaurants, bars with live music and a craft market.', es: 'Restaurantes, bares con música en vivo y mercadillo de artesanía.' },
    'agito': { en: 'nightlife', es: 'ambiente' },
    '🚐 Transfer 24h': { en: '🚐 24h Transfer', es: '🚐 Transfer 24h' },
    'Traslados aeroporto/hotel e passeios. Consulte o anfitrião para indicação.': { en: 'Airport/hotel transfers and tours. Ask the host for a recommendation.', es: 'Traslados aeropuerto/hotel y paseos. Consulta al anfitrión para una recomendación.' },
    'As indicações de passeios e transfer são cortesia, espontâneas e não comerciais, baseadas em boas experiências anteriores — sem qualquer vínculo ou responsabilidade do anfitrião. Consulte o anfitrião para as empresas.': { en: 'Tour and transfer suggestions are a courtesy, spontaneous and non-commercial, based on good past experiences — without any tie or responsibility of the host. Ask the host for the companies.', es: 'Las recomendaciones de paseos y transfer son una cortesía, espontáneas y no comerciales, basadas en buenas experiencias anteriores — sin ningún vínculo ni responsabilidad del anfitrión. Consulta al anfitrión para las empresas.' },

    // onde comer
    'Truta, salmão e lagosta, drinques e carta de vinhos. Decoração delicada.': { en: 'Trout, salmon and lobster, drinks and a wine list. Delicate décor.', es: 'Trucha, salmón y langosta, bebidas y carta de vinos. Decoración delicada.' },
    'desde 1994': { en: 'since 1994', es: 'desde 1994' },
    'Drinks, música ao vivo e vibe única. Das 10h às 3h.': { en: 'Drinks, live music and a unique vibe. From 10 AM to 3 AM.', es: 'Bebidas, música en vivo y un ambiente único. De 10h a 3h.' },
    'Ótimo café da manhã. Café excelente e atendimento maravilhoso.': { en: 'Great breakfast. Excellent coffee and wonderful service.', es: 'Excelente desayuno. Café estupendo y atención maravillosa.' },
    'Na mesma rua do Di Maré. Café da manhã pago por consumo.': { en: 'On the same street as Di Maré. Pay-as-you-go breakfast.', es: 'En la misma calle del Di Maré. Desayuno pagado por consumo.' },
    'Pizza de massa fina e comida italiana.': { en: 'Thin-crust pizza and Italian food.', es: 'Pizza de masa fina y comida italiana.' },
    'Varanda à beira-mar e culinária de frutos do mar.': { en: 'Seaside veranda and seafood cuisine.', es: 'Terraza junto al mar y cocina de mariscos.' },
    'No coração de Porto. Cardápio cheio de delícias e preço acessível.': { en: 'In the heart of Porto. A menu full of delights at an affordable price.', es: 'En el corazón de Porto. Carta llena de delicias y precio accesible.' },
    'café regional': { en: 'regional breakfast', es: 'desayuno regional' },
    'Frutas tropicais, sucos, omeletes e tapiocas. Reserva com 1 dia de antecedência.': { en: 'Tropical fruit, juices, omelets and tapiocas. Book 1 day in advance.', es: 'Frutas tropicales, jugos, tortillas y tapiocas. Reserva con 1 día de antelación.' },
    'Arquitetura rústica e pescados. Camarão com mel de engenho e arroz com maracujá.': { en: 'Rustic architecture and fish dishes. Shrimp with cane honey and passion-fruit rice.', es: 'Arquitectura rústica y pescados. Camarón con miel de caña y arroz con maracuyá.' },

    // veganas
    'Para quem prefere o cardápio plant-based, esses são ótimos endereços. 🌱': { en: 'For those who prefer a plant-based menu, these are great spots. 🌱', es: 'Para quienes prefieren el menú plant-based, estos son grandes lugares. 🌱' },
    'Pizzas artesanais de fermentação natural e queijos vegetais para montar do seu jeito.': { en: 'Artisanal naturally-leavened pizzas and plant cheeses to build your own way.', es: 'Pizzas artesanales de fermentación natural y quesos vegetales para armar a tu gusto.' },
    'Especializada em crepes e saladas, no belíssimo balneário de Porto de Galinhas.': { en: 'Specializing in crêpes and salads, at the beautiful Porto de Galinhas seaside.', es: 'Especializada en crepes y ensaladas, en el bellísimo balneario de Porto de Galinhas.' },
    '"Ele Sal, Ela Doce" — casal de chefs paulistas. Pratos e sobremesas autorais.': { en: '"He Savory, She Sweet" — a couple of chefs from São Paulo. Signature dishes and desserts.', es: '"Él Salado, Ella Dulce" — pareja de chefs paulistas. Platos y postres de autor.' },
    'O melhor açaí, além de crepes, tapiocas, sanduíches, sucos e smoothies.': { en: 'The best açaí, plus crêpes, tapiocas, sandwiches, juices and smoothies.', es: 'El mejor açaí, además de crepes, tapiocas, sándwiches, jugos y smoothies.' },

    // obrigado
    'com carinho,': { en: 'with love,', es: 'con cariño,' },
    'Esperamos que sua experiência em Porto de Galinhas seja inesquecível. ♡': { en: 'We hope your experience in Porto de Galinhas is unforgettable. ♡', es: 'Esperamos que tu experiencia en Porto de Galinhas sea inolvidable. ♡' },
    'Conte com a gente durante toda a hospedagem.': { en: 'Count on us throughout your stay.', es: 'Cuenta con nosotros durante toda la estancia.' },
    'Se gostou, deixe sua': { en: 'If you enjoyed it, leave your', es: 'Si te gustó, deja tu' },
    'avaliação': { en: 'review', es: 'reseña' },
    '— significa muito para nós.': { en: '— it means a lot to us.', es: '— significa mucho para nosotros.' },
  };

  const norm = (s) => s.replace(/\s+/g, ' ').trim();
  const blockKey = (el) => el.innerHTML.replace(/<br\b[^>]*>/gi, ' ').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

  const pages = () => document.querySelectorAll('[data-document-role="page"]');

  // Snapshot originals once.
  const textNodes = [];
  const blockEls = [];

  function collect() {
    pages().forEach((p) => {
      p.querySelectorAll('.section-title, .h-section, .thanks-title, .stamp').forEach((el) => {
        if (el.dataset.i18nBlock) return;
        el.dataset.i18nBlock = '1';
        blockEls.push({ el, pt: el.innerHTML, key: blockKey(el) });
      });
      const walker = document.createTreeWalker(p, NodeFilter.SHOW_TEXT, {
        acceptNode(n) {
          if (!n.nodeValue || !n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
          if (n.parentElement && n.parentElement.closest('[data-i18n-block]')) return NodeFilter.FILTER_REJECT;
          return NodeFilter.FILTER_ACCEPT;
        },
      });
      let n;
      while ((n = walker.nextNode())) textNodes.push({ node: n, pt: n.nodeValue });
    });
  }

  function apply(lang) {
    // text nodes
    textNodes.forEach(({ node, pt }) => {
      if (lang === 'pt') { node.nodeValue = pt; return; }
      const tr = T[norm(pt)];
      if (tr && tr[lang]) {
        const lead = (pt.match(/^\s*/) || [''])[0];
        const trail = (pt.match(/\s*$/) || [''])[0];
        node.nodeValue = lead + tr[lang] + trail;
      } else {
        node.nodeValue = pt;
      }
    });
    // block elements
    blockEls.forEach(({ el, pt, key }) => {
      if (lang === 'pt') { el.innerHTML = pt; return; }
      const tr = BLOCK[key];
      el.innerHTML = (tr && tr[lang]) ? tr[lang] : pt;
    });
    document.documentElement.setAttribute('lang', lang === 'pt' ? 'pt-BR' : lang);
    document.querySelectorAll('.lang-flag').forEach((b) => {
      const isActive = b.dataset.lang === lang;
      b.classList.toggle('active', isActive);
      b.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      // The Brazil flag only shows once a translation is active (to return).
      if (b.dataset.lang === 'pt') b.style.display = (lang === 'pt') ? 'none' : 'block';
    });
    try { localStorage.setItem('guia-lang', lang); } catch (e) {}
  }

  const META = [
    ['br', 'Português', 'pt'],
    ['us', 'English', 'en'],
    ['es', 'Español', 'es'],
  ];
  const FLAGS = {
    br: '<svg viewBox="0 0 28 20"><rect width="28" height="20" fill="#009B3A"/><polygon points="14,2.5 25.5,10 14,17.5 2.5,10" fill="#FEDF00"/><circle cx="14" cy="10" r="4.4" fill="#002776"/></svg>',
    us: '<svg viewBox="0 0 28 20"><rect width="28" height="20" fill="#fff"/>' +
        [0,2,4,6,8,10,12].map((i) => `<rect y="${i*(20/13)}" width="28" height="${20/13}" fill="#B22234"/>`).join('') +
        `<rect width="12" height="${20/13*7}" fill="#3C3B6E"/>` +
        '<g fill="#fff">' + [[2,2.4],[5,2.4],[8,2.4],[3.5,5.2],[6.5,5.2],[9.5,5.2]].map(([x,y]) => `<circle cx="${x}" cy="${y}" r="0.7"/>`).join('') + '</g></svg>',
    es: '<svg viewBox="0 0 28 20"><rect width="28" height="20" fill="#AA151B"/><rect y="5" width="28" height="10" fill="#F1BF00"/></svg>',
  };

  function makeGroup() {
    const g = document.createElement('div');
    g.className = 'lang-flags';
    g.setAttribute('data-noncommentable', '');
    META.forEach(([flag, label, lang]) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'lang-flag';
      b.dataset.lang = lang;
      b.title = label;
      b.setAttribute('aria-label', label);
      b.innerHTML = FLAGS[flag];
      b.addEventListener('click', () => apply(b.dataset.lang));
      g.appendChild(b);
    });
    return g;
  }

  function buildBar() {
    // One flag group per page, beside the "Índice" button in the header.
    document.querySelectorAll('section.page').forEach((sec) => {
      if (sec.querySelector('.lang-flags')) return;
      const g = makeGroup();

      const right = sec.querySelector('.hdr-right');
      if (right) { right.insertBefore(g, right.firstChild); return; }

      const hdr = sec.querySelector('.hdr');
      if (hdr) {
        const pg = hdr.querySelector('.hdr-pg');
        if (pg) hdr.insertBefore(g, pg); else hdr.appendChild(g);
        return;
      }

      const fl = sec.querySelector('.btn-index-float');
      if (fl) {
        const wrap = document.createElement('div');
        wrap.className = 'lang-float';
        fl.parentNode.insertBefore(wrap, fl);
        wrap.appendChild(g);
        wrap.appendChild(fl);
        return;
      }

      const ct = sec.querySelector('.cover-top');
      if (ct) {
        const stamp = ct.querySelector('.cover-stamp');
        const wrap = document.createElement('div');
        wrap.className = 'cover-top-right';
        ct.insertBefore(wrap, stamp || null);
        wrap.appendChild(g);
        if (stamp) wrap.appendChild(stamp);
      }
    });
  }

  function init() {
    collect();
    buildBar();
    let saved = 'pt';
    try { saved = localStorage.getItem('guia-lang') || 'pt'; } catch (e) {}
    apply(saved);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
