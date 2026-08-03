// i18n.js — language switcher (PT · EN · ES) for the Di Maré guest guide.
// Flags at top-right swap every translatable string in place. Choice persists.
// Runs AFTER app.js so dynamically-added buttons/greetings are captured.
(() => {
  'use strict';

  // Reserved for future innerHTML-level (multi-tag) translations; unused
  // today since every current title splits cleanly into plain text nodes.
  const BLOCK = {};

  // ── Plain text-node strings (keyed by collapsed PT text) ───────────────
  const T = {
    // capa / seleção de flat
    'Boas-vindas': { en: 'Welcome', es: 'Bienvenida' },
    'Olá! Que bom que você chegou!': { en: 'Hello! So glad you made it!', es: '¡Hola! ¡Qué bueno que llegaste!' },
    'Antes de desfazer as malas, uma perguntinha importante...': { en: 'Before you unpack, one important question...', es: 'Antes de deshacer las maletas, una preguntita importante...' },
    'Em qual pedacinho do paraíso você vai ficar?': { en: 'Which little piece of paradise will you be staying in?', es: '¿En qué rincón del paraíso te vas a quedar?' },
    '1º Andar': { en: '1st Floor', es: '1er Piso' },
    'Vista Mar': { en: 'Ocean View', es: 'Vista al Mar' },
    '2º Andar': { en: '2nd Floor', es: '2º Piso' },
    'Toque no card do seu flat reservado e confira todas as informações da sua estadia.': { en: 'Tap the card of your reserved flat and check all the information for your stay.', es: 'Toca la tarjeta de tu flat reservado y consulta toda la información de tu estancia.' },
    'bem-vindo(a)': { en: 'welcome', es: 'bienvenido(a)' },
    'Olá! 😊': { en: 'Hello! 😊', es: '¡Hola! 😊' },
    'É um prazer recebê-lo(a) em nossa acomodação, e espero que sua estadia seja maravilhosa desde o primeiro instante!': { en: 'It’s a pleasure to welcome you to our place, and I hope your stay is wonderful from the very first moment!', es: '¡Es un placer recibirte en nuestro alojamiento, y espero que tu estancia sea maravillosa desde el primer instante!' },
    'Assim que possível, dê uma olhadinha geral no apartamento para verificar se está tudo certo: limpeza, itens disponíveis, estrutura.': { en: 'As soon as you can, take a general look around the apartment to check everything’s in order: cleanliness, available items, structure.', es: 'En cuanto puedas, echa un vistazo general al apartamento para comprobar que todo esté bien: limpieza, artículos disponibles, estructura.' },
    'Caso note qualquer detalhe que não esteja conforme estabelecido na plataforma, ou tenha qualquer dúvida,': { en: 'If you notice any detail that doesn’t match what’s stated on the platform, or have any questions,', es: 'Si notas algún detalle que no esté conforme a lo establecido en la plataforma, o tienes alguna duda,' },
    'me envie uma mensagem': { en: 'send me a message', es: 'envíame un mensaje' },
    '. Estarei à disposição para resolver prontamente e garantir o seu conforto e bem-estar. Conte comigo durante toda a sua estadia!': { en: '. I’ll be available to resolve it right away and ensure your comfort and well-being. Count on me throughout your stay!', es: '. Estaré a disposición para resolverlo de inmediato y garantizar tu comodidad y bienestar. ¡Cuenta conmigo durante toda tu estancia!' },
    'Qual é o seu flat?': { en: 'Which is your flat?', es: '¿Cuál es tu flat?' },
    'Toque no seu apartamento para acessar o guia personalizado.': { en: 'Tap your apartment to access its personalized guide.', es: 'Toca tu apartamento para acceder a la guía personalizada.' },

    // botões comuns
    'Falar com o anfitrião': { en: 'Message the host', es: 'Hablar con el anfitrión' },
    'Ainda com dúvida? Fale com o anfitrião': { en: 'Still have questions? Message the host', es: '¿Aún tienes dudas? Habla con el anfitrión' },
    'MENU': { en: 'MENU', es: 'MENÚ' },
    'COPIAR': { en: 'COPY', es: 'COPIAR' },

    // índice
    'Bem-vindo(a)': { en: 'Welcome', es: 'Bienvenido(a)' },
    'Sua estadia - Tudo o que você precisa, em um só lugar.': { en: 'Your stay - Everything you need, all in one place.', es: 'Tu estancia - Todo lo que necesitas, en un solo lugar.' },
    'Bom dia, seja bem-vindo(a)': { en: 'Good morning, welcome', es: 'Buenos días, sé bienvenido(a)' },
    'Boa tarde, seja bem-vindo(a)': { en: 'Good afternoon, welcome', es: 'Buenas tardes, sé bienvenido(a)' },
    'Boa noite, seja bem-vindo(a)': { en: 'Good evening, welcome', es: 'Buenas noches, sé bienvenido(a)' },
    'Bom dia, seja muito bem-vindo(a)!': { en: 'Good morning, a very warm welcome!', es: '¡Buenos días, sé muy bienvenido(a)!' },
    'Boa tarde, seja muito bem-vindo(a)!': { en: 'Good afternoon, a very warm welcome!', es: '¡Buenas tardes, sé muy bienvenido(a)!' },
    'Boa noite, seja muito bem-vindo(a)!': { en: 'Good evening, a very warm welcome!', es: '¡Buenas noches, sé muy bienvenido(a)!' },
    'Tudo o que você precisa, em um só lugar.': { en: 'Everything you need, all in one place.', es: 'Todo lo que necesitas, en un solo lugar.' },
    'Aqui você encontrará informações sobre o apartamento, o condomínio, entretenimentos, restaurantes, passeios e diversas dicas para aproveitar ao máximo sua estadia.': { en: 'Here you’ll find information about the apartment, the condominium, entertainment, restaurants, tours and lots of tips to make the most of your stay.', es: 'Aquí encontrarás información sobre el apartamento, el condominio, entretenimiento, restaurantes, paseos y varios consejos para aprovechar al máximo tu estancia.' },
    'Como ter energia no flat': { en: 'How to get power in the flat', es: 'Cómo activar la energía en el flat' },
    'Acione a luz em 30 segundos': { en: 'Turn the lights on in 30 seconds', es: 'Activa la luz en 30 segundos' },
    'Check-in · Confira Tudo': { en: 'Check-in · Check Everything', es: 'Check-in · Revisa Todo' },
    'Enxoval e amenidades': { en: 'Linens and amenities', es: 'Ropa de cama y amenidades' },
    'Como chegar no Di Maré Residence?': { en: 'How to get to Di Maré Residence?', es: '¿Cómo llegar al Di Maré Residence?' },
    'Endereço e rota': { en: 'Address and route', es: 'Dirección y ruta' },
    'Wi-Fi': { en: 'Wi-Fi', es: 'Wi-Fi' },
    'Rede e senha': { en: 'Network and password', es: 'Red y contraseña' },
    'A fechadura eletrônica não funcionou?': { en: 'The electronic lock didn’t work?', es: '¿La cerradura electrónica no funcionó?' },
    'Código e uso': { en: 'Code and instructions', es: 'Código y uso' },
    'Ventilador de Teto': { en: 'Ceiling Fan', es: 'Ventilador de Techo' },
    'Controle e velocidades': { en: 'Control and speeds', es: 'Control y velocidades' },
    'Troca de Enxoval': { en: 'Linen Change', es: 'Cambio de Ropa de Cama' },
    'Roupas de cama e banho': { en: 'Bed and bath linens', es: 'Ropa de cama y baño' },
    'Regras da Casa': { en: 'House Rules', es: 'Normas de la Casa' },
    'Boa convivência': { en: 'Good neighborly living', es: 'Buena convivencia' },
    'Estacionamento': { en: 'Parking', es: 'Estacionamiento' },
    'Onde estacionar': { en: 'Where to park', es: 'Dónde estacionar' },
    'Coleta de Lixo': { en: 'Trash Collection', es: 'Recolección de Basura' },
    'Dias e horários': { en: 'Days and times', es: 'Días y horarios' },
    'Check-out': { en: 'Check-out', es: 'Check-out' },
    'Até às 11h': { en: 'Until 11 AM', es: 'Hasta las 11h' },
    'Ao redor': { en: 'Nearby', es: 'Alrededores' },
    'Descubra as belezas de Porto de Galinhas.': { en: 'Discover the beauty of Porto de Galinhas.', es: 'Descubre las bellezas de Porto de Galinhas.' },
    'O que Fazer': { en: 'What to Do', es: 'Qué Hacer' },
    'Passeios e experiências': { en: 'Tours and experiences', es: 'Paseos y experiencias' },
    'Onde Comer': { en: 'Where to Eat', es: 'Dónde Comer' },
    'Restaurantes favoritos': { en: 'Favorite restaurants', es: 'Restaurantes favoritos' },
    'Localização': { en: 'Location', es: 'Ubicación' },
    '"Sinta-se em casa, à beira do mar."': { en: '"Feel at home, by the sea."', es: '"Siéntete en casa, junto al mar."' },
    'Qualquer dúvida, fale com seu anfitrião': { en: 'Any questions, message your host', es: 'Cualquier duda, habla con tu anfitrión' },

    // garagem & energia
    'Garagem &': { en: 'Garage &', es: 'Garaje &' },
    'estacionamento': { en: 'parking', es: 'estacionamiento' },
    'Onde fica a entrada da garagem?': { en: 'Where’s the garage entrance?', es: '¿Dónde está la entrada del garaje?' },
    'O acesso é pela': { en: 'Access is via', es: 'El acceso es por la' },
    'Praça 5': { en: 'Praça 5', es: 'Praça 5' },
    'Posso usar qualquer vaga?': { en: 'Can I use any space?', es: '¿Puedo usar cualquier plaza?' },
    'Sim! Utilize qualquer vaga livre,': { en: 'Yes! Use any free space,', es: '¡Sí! Usa cualquier plaza libre,' },
    'sem custo': { en: 'at no cost', es: 'sin costo' },
    'É a primeira vez entrando?': { en: 'Is this your first time entering?', es: '¿Es la primera vez que entras?' },
    'O porteiro pode ajudar no primeiro acesso.': { en: 'The doorman can help with your first access.', es: 'El portero puede ayudar en el primer acceso.' },
    'E se não houver porteiro?': { en: 'What if there’s no doorman?', es: '¿Y si no hay portero?' },
    'O': { en: 'The', es: 'El' },
    'controle remoto do portão': { en: 'gate remote control', es: 'control remoto del portón' },
    'está na prateleira do flat.': { en: 'is on the flat’s shelf.', es: 'está en el estante del flat.' },
    'O portão fecha sozinho?': { en: 'Does the gate close by itself?', es: '¿El portón se cierra solo?' },
    'Sim! Ele fecha automaticamente cerca de': { en: 'Yes! It closes automatically around', es: '¡Sí! Se cierra automáticamente en unos' },
    '40 segundos': { en: '40 seconds', es: '40 segundos' },
    'após ser acionado.': { en: 'after being triggered.', es: 'después de accionarse.' },

    // controlador de energia
    'Controlador': { en: 'Power', es: 'Controlador' },
    'de energia': { en: 'controller', es: 'de energía' },
    'Nosso flat possui um ⚡ Controlador de Energia, mas não se preocupe: é bem simples! 😉': { en: 'Our flat has a ⚡ Power Controller, but don’t worry — it’s super simple! 😉', es: 'Nuestro flat tiene un ⚡ Controlador de Energía, pero no te preocupes: ¡es bien sencillo! 😉' },
    'Como ligar a energia?': { en: 'How do I turn on the power?', es: '¿Cómo enciendo la energía?' },
    'Basta apertar o botão indicado pela seta abaixo, próximo ao interruptor na entrada.': { en: 'Just press the button shown by the arrow below, next to the switch at the entrance.', es: 'Basta con presionar el botón indicado por la flecha de abajo, junto al interruptor de la entrada.' },
    'E quando a porta for aberta ou fechada?': { en: 'What about when the door is opened or closed?', es: '¿Y cuando la puerta se abra o se cierre?' },
    'Aperte o botão novamente, sempre que a porta do apartamento for fechada.': { en: 'Press the button again whenever the apartment door is closed.', es: 'Presiona el botón nuevamente cada vez que se cierre la puerta del apartamento.' },
    'Hei, e se alguém permanecer no apartamento enquanto outra pessoa sair, o que fazer?': { en: 'Hey, what if someone stays in the apartment while someone else goes out — what should I do?', es: 'Oye, ¿y si alguien se queda en el apartamento mientras otra persona sale, qué hago?' },
    'Quem ficou dentro deve apertar o botão após a porta ser fechada.': { en: 'Whoever stayed inside should press the button after the door is closed.', es: 'Quien se quedó dentro debe presionar el botón después de que la puerta se cierre.' },
    'Onde fica o botão do economizador de energia, ao lado do interruptor.': { en: 'Where the power-saver button is, next to the switch.', es: 'Dónde está el botón del ahorrador de energía, junto al interruptor.' },
    'É só um clique e tudo continua funcionando normalmente! 😊': { en: 'It’s just one click and everything keeps working normally! 😊', es: '¡Es solo un clic y todo sigue funcionando normalmente! 😊' },

    // check-in
    'Check-in': { en: 'Check-in', es: 'Check-in' },
    'confira tudo': { en: 'check everything', es: 'revisa todo' },
    'Tudo certo por aí? 😊': { en: 'Everything OK over there? 😊', es: '¿Todo bien por ahí? 😊' },
    'Em até 2 horas após o check-in, confira se todos os itens do apartamento estão disponíveis. Se notar qualquer ausência, avise-nos para que possamos resolver o mais rápido possível.': { en: 'Within 2 hours of check-in, check that all the apartment’s items are available. If you notice anything missing, let us know so we can resolve it as quickly as possible.', es: 'En un plazo de 2 horas tras el check-in, verifica que todos los artículos del apartamento estén disponibles. Si notas alguna ausencia, avísanos para que podamos resolverlo lo más rápido posible.' },
    'Cama': { en: 'Bed', es: 'Cama' },
    '2 jogos de lençóis': { en: '2 sets of sheets', es: '2 juegos de sábanas' },
    '2 edredons': { en: '2 duvets', es: '2 edredones' },
    '4 fronhas': { en: '4 pillowcases', es: '4 fundas de almohada' },
    '2 mantas': { en: '2 blankets', es: '2 mantas' },
    'Banho': { en: 'Bath', es: 'Baño' },
    '4 toalhas de banho': { en: '4 bath towels', es: '4 toallas de baño' },
    '2 toalhas de banho': { en: '2 bath towels', es: '2 toallas de baño' },
    '2 toalhas de rosto': { en: '2 hand towels', es: '2 toallas de mano' },
    '1 toalha de piso': { en: '1 bath mat', es: '1 alfombra de baño' },
    'Praia': { en: 'Beach', es: 'Playa' },
    '2 toalhas de praia': { en: '2 beach towels', es: '2 toallas de playa' },
    'Amenidades': { en: 'Amenities', es: 'Amenidades' },
    '4 kits de shampoo/condicionador': { en: '4 shampoo/conditioner kits', es: '4 kits de champú/acondicionador' },
    '4 sabonetes': { en: '4 bars of soap', es: '4 jabones' },
    '3 rolos de papel higiênico': { en: '3 rolls of toilet paper', es: '3 rollos de papel higiénico' },
    'Cozinha e limpeza': { en: 'Kitchen and cleaning', es: 'Cocina y limpieza' },
    'Detergente': { en: 'Dish soap', es: 'Detergente' },
    'Esponja': { en: 'Sponge', es: 'Esponja' },
    '2 panos de chão': { en: '2 floor cloths', es: '2 paños de piso' },
    '2 tapetes': { en: '2 rugs', es: '2 alfombras' },
    '2 panos de prato': { en: '2 dish towels', es: '2 paños de cocina' },
    'Encontrou alguma coisa fora do lugar? Avise ao anfitrião pelo WhatsApp em até': { en: 'Found something out of place? Let the host know via WhatsApp within', es: '¿Encontraste algo fuera de lugar? Avisa al anfitrión por WhatsApp en un plazo de' },
    '2 horas após o check-in': { en: '2 hours after check-in', es: '2 horas tras el check-in' },
    '. Como nosso enxoval e reposição são terceirizados, esse prazo nos ajuda a resolver qualquer detalhe rapidinho em até': { en: '. Since our linens and restocking are outsourced, this window helps us resolve any detail quickly, within', es: '. Como nuestra ropa de cama y reposición son tercerizadas, este plazo nos ayuda a resolver cualquier detalle rápidamente, en' },
    '24 horas': { en: '24 hours', es: '24 horas' },
    'Obrigado pela conferência e aproveite o sol, a brisa e a sua estadia! ☀️🌴': { en: 'Thanks for checking, and enjoy the sun, the breeze and your stay! ☀️🌴', es: '¡Gracias por la revisión y disfruta del sol, la brisa y tu estancia! ☀️🌴' },
    '1 jogo de lençóis': { en: '1 set of sheets', es: '1 juego de sábanas' },
    '1 edredom': { en: '1 duvet', es: '1 edredón' },
    '2 fronhas': { en: '2 pillowcases', es: '2 fundas de almohada' },
    '1 manta': { en: '1 blanket', es: '1 manta' },
    '1 toalha de praia': { en: '1 beach towel', es: '1 toalla de playa' },
    '2 kits de shampoo/condicionador': { en: '2 shampoo/conditioner kits', es: '2 kits de champú/acondicionador' },
    '2 sabonetes': { en: '2 bars of soap', es: '2 jabones' },
    '2 rolos de papel higiênico': { en: '2 rolls of toilet paper', es: '2 rollos de papel higiénico' },
    '1 pano de chão': { en: '1 floor cloth', es: '1 paño de piso' },

    // wifi
    'Wifi': { en: 'Wifi', es: 'Wifi' },
    '📶 Prontinho! Aqui estão os dados para você se conectar ao Wi-Fi.': { en: '📶 All set! Here’s what you need to connect to the Wi-Fi.', es: '📶 ¡Listo! Aquí están los datos para conectarte al Wi-Fi.' },
    'Rede': { en: 'Network', es: 'Red' },
    'Senha': { en: 'Password', es: 'Contraseña' },
    'Prontinho! Agora é só conectar e aproveitar. 😉': { en: 'All set! Now just connect and enjoy. 😉', es: '¡Listo! Ahora solo conéctate y disfruta. 😉' },

    // coleta de lixo
    'Coleta': { en: 'Trash', es: 'Recolección' },
    'de lixo': { en: 'collection', es: 'de basura' },
    'A área externa deve permanecer livre de sacos de lixo, contribuindo para a limpeza, a organização e o bem-estar de todos.': { en: 'The outdoor area must stay free of trash bags, helping keep things clean, organized and pleasant for everyone.', es: 'El área externa debe permanecer libre de bolsas de basura, contribuyendo a la limpieza, el orden y el bienestar de todos.' },
    '♻️ Como funciona a coleta?': { en: '♻️ How does collection work?', es: '♻️ ¿Cómo funciona la recolección?' },
    'A zeladoria realiza a retirada diariamente, das': { en: 'The building staff collects it daily, from', es: 'El personal de mantenimiento retira la basura diariamente, de' },
    '9h às 12h': { en: '9 AM to 12 PM', es: '9h a 12h' },
    '🚪 O que preciso fazer?': { en: '🚪 What do I need to do?', es: '🚪 ¿Qué necesito hacer?' },
    'Deixe a': { en: 'Leave the', es: 'Deja la' },
    'placa de coleta': { en: 'collection sign', es: 'placa de recolección' },
    'na maçaneta externa nesse horário e pronto!': { en: 'on the outside door handle during that window, and that’s it!', es: 'en la manija externa en ese horario, ¡y listo!' },
    '🚫 Posso deixar o lixo do lado de fora?': { en: '🚫 Can I leave trash outside?', es: '🚫 ¿Puedo dejar la basura afuera?' },
    'Não. Para manter tudo organizado, não deixe sacos de lixo na área externa.': { en: 'No. To keep everything tidy, don’t leave trash bags in the outdoor area.', es: 'No. Para mantener todo organizado, no dejes bolsas de basura en el área externa.' },
    '⏰ Perdi o horário?': { en: '⏰ Missed the time window?', es: '⏰ ¿Perdí el horario?' },
    'Sem problema! Faça o descarte no': { en: 'No problem! Dispose of it at the', es: '¡Sin problema! Deséchala en el' },
    'subsolo da garagem': { en: 'garage basement', es: 'subsuelo del garaje' },
    'Um pequeno cuidado que deixa o ambiente agradável para todos. 😊': { en: 'A small courtesy that keeps things pleasant for everyone. 😊', es: 'Un pequeño cuidado que hace el ambiente agradable para todos. 😊' },

    // ventilador
    'Ventilador': { en: 'Ceiling', es: 'Ventilador' },
    'de teto': { en: 'fan', es: 'de techo' },
    '🌀 Como usar o controle do ventilador?': { en: '🌀 How do I use the fan control?', es: '🌀 ¿Cómo uso el control del ventilador?' },
    'Botão 1': { en: 'Button 1', es: 'Botón 1' },
    '— Liga e desliga a luz principal.': { en: '— Turns the main light on and off.', es: '— Enciende y apaga la luz principal.' },
    'Botão 2': { en: 'Button 2', es: 'Botón 2' },
    '— Liga e desliga a luz de LED.': { en: '— Turns the LED light on and off.', es: '— Enciende y apaga la luz LED.' },
    'Botão 3': { en: 'Button 3', es: 'Botón 3' },
    '— Alterna o sentido da rotação (ventilar ou exaurir o ar).': { en: '— Switches the rotation direction (cool or exhaust air).', es: '— Cambia el sentido de rotación (ventilar o extraer el aire).' },
    'E a velocidade do vento?': { en: 'What about the wind speed?', es: '¿Y la velocidad del viento?' },
    'É só girar o botão rotativo (⟳) para ajustar do jeitinho que você preferir.': { en: 'Just turn the rotary knob (⟳) to adjust it however you prefer.', es: 'Solo gira la perilla giratoria (⟳) para ajustarla como prefieras.' },

    // troca de enxoval
    'Troca': { en: 'Linen', es: 'Cambio' },
    'de enxoval': { en: 'change', es: 'de ropa de cama' },
    'Posso solicitar a troca de enxoval?': { en: 'Can I request a linen change?', es: '¿Puedo solicitar el cambio de ropa de cama?' },
    'Sim! O serviço está disponível para estadias': { en: 'Yes! This service is available for stays', es: '¡Sí! El servicio está disponible para estancias' },
    'superiores a 5 noites': { en: 'longer than 5 nights', es: 'superiores a 5 noches' },
    'Como solicitar?': { en: 'How do I request it?', es: '¿Cómo lo solicito?' },
    'É só': { en: 'Just', es: 'Solo' },
    'agendar': { en: 'schedule it', es: 'agenda' },
    'com o anfitrião.': { en: 'with the host.', es: 'con el anfitrión.' },
    'Qual o prazo?': { en: 'What’s the notice period?', es: '¿Cuál es el plazo?' },
    'Pedimos que a solicitação seja feita com pelo menos': { en: 'Please make the request at least', es: 'Pedimos que la solicitud se haga con al menos' },
    '24 horas de antecedência': { en: '24 hours in advance', es: '24 horas de antelación' },
    '. Assim, conseguimos organizar tudo para você! 😊': { en: '. That way we can get everything organized for you! 😊', es: '. ¡Así logramos organizar todo para ti! 😊' },

    // fechadura eletrônica
    '🔐 A fechadura eletrônica': { en: '🔐 The electronic lock', es: '🔐 La cerradura electrónica' },
    'não funcionou?': { en: 'didn’t work?', es: '¿no funcionó?' },
    '😅 Calma, temos um plano B! Há um cofre Pado ao lado da porta do apartamento.': { en: '😅 No worries, we have a plan B! There’s a Pado safe next to the apartment door.', es: '😅 Tranquilo(a), ¡tenemos un plan B! Hay una caja fuerte Pado junto a la puerta del apartamento.' },
    'Localize o cofre Pado fixado na parede, próximo à entrada do flat.': { en: 'Find the Pado safe mounted on the wall, near the flat’s entrance.', es: 'Localiza la caja fuerte Pado fijada en la pared, cerca de la entrada del flat.' },
    'Como abrir?': { en: 'How do I open it?', es: '¿Cómo se abre?' },
    'Use a senha:': { en: 'Use the code:', es: 'Usa la clave:' },
    'O que tem dentro?': { en: 'What’s inside?', es: '¿Qué hay dentro?' },
    'Você encontrará uma chave, uma TAG e as pilhas de reposição (palito para a fechadura, moeda para a garagem).': { en: 'You’ll find a key, a TAG fob and replacement batteries (stick-type for the lock, coin-type for the garage).', es: 'Encontrarás una llave, un TAG y las pilas de repuesto (tipo palito para la cerradura, tipo moneda para el garaje).' },
    'Como abrir a porta?': { en: 'How do I open the door?', es: '¿Cómo abro la puerta?' },
    'Use a chave na parte inferior da fechadura eletrônica.': { en: 'Use the key on the lower part of the electronic lock.', es: 'Usa la llave en la parte inferior de la cerradura electrónica.' },
    'E depois?': { en: 'And then?', es: '¿Y después?' },
    'Troque as pilhas da fechadura pelo lado de dentro.': { en: 'Replace the lock’s batteries from the inside.', es: 'Cambia las pilas de la cerradura desde el interior.' },
    'Antes de sair:': { en: 'Before you leave:', es: 'Antes de salir:' },
    'devolva a chave, a TAG e as pilhas ao cofre, feche-o e embaralhe a senha novamente. 😉': { en: 'return the key, the TAG fob and the batteries to the safe, close it and scramble the code again. 😉', es: 'devuelve la llave, el TAG y las pilas a la caja fuerte, ciérrala y vuelve a mezclar la clave. 😉' },
    'Pronto! Problema resolvido e a estadia continua normalmente. 😊': { en: 'Done! Problem solved and your stay carries on as normal. 😊', es: '¡Listo! Problema resuelto y la estancia continúa con normalidad. 😊' },

    // regras da casa
    'Regras': { en: 'House', es: 'Normas' },
    'da casa': { en: 'rules', es: 'de la casa' },
    'Regrinhas importantes para o bem-estar de todos. ♡': { en: 'A few important rules for everyone’s well-being. ♡', es: 'Normitas importantes para el bienestar de todos. ♡' },
    '🐶 Pets são permitidos?': { en: '🐶 Are pets allowed?', es: '🐶 ¿Se permiten mascotas?' },
    'Este apartamento foi preparado para ser um ambiente livre de pets. Agradecemos a sua compreensão.': { en: 'This apartment has been set up as a pet-free environment. Thank you for your understanding.', es: 'Este apartamento fue preparado para ser un ambiente libre de mascotas. Agradecemos tu comprensión.' },
    '🔊 Posso colocar som alto?': { en: '🔊 Can I play loud music?', es: '🔊 ¿Puedo poner música alta?' },
    'Mantenha o volume em nível baixo no apartamento e nas áreas comuns, respeitando o conforto e o descanso de todos.': { en: 'Keep the volume low in the apartment and in common areas, respecting everyone’s comfort and rest.', es: 'Mantén el volumen bajo en el apartamento y en las áreas comunes, respetando el confort y el descanso de todos.' },
    '🥂 Copos de vidro no rooftop?': { en: '🥂 Glass cups on the rooftop?', es: '🥂 ¿Vasos de vidrio en el rooftop?' },
    'Prefira copos de plástico disponível no interior do apartamento.': { en: 'Please use the plastic cups available inside the apartment.', es: 'Prefiere los vasos de plástico disponibles dentro del apartamento.' },
    '🎉 Visitas ou festas?': { en: '🎉 Visitors or parties?', es: '🎉 ¿Visitas o fiestas?' },
    'Este apartamento foi preparado exclusivamente para receber os hóspedes da reserva. Agradecemos por respeitar essa regra de convivência.': { en: 'This apartment is set up exclusively for the guests on the reservation. Thank you for respecting this house rule.', es: 'Este apartamento fue preparado exclusivamente para recibir a los huéspedes de la reserva. Agradecemos que respetes esta norma de convivencia.' },
    '🏊 Horário da piscina?': { en: '🏊 Pool hours?', es: '🏊 ¿Horario de la piscina?' },
    'Das 8h às 21h.': { en: 'From 8 AM to 9 PM.', es: 'De 8h a 21h.' },
    '🔥 Posso usar a churrasqueira?': { en: '🔥 Can I use the barbecue?', es: '🔥 ¿Puedo usar la parrilla?' },
    'Sim! Basta fazer o agendamento na recepção.': { en: 'Yes! Just book it at reception.', es: '¡Sí! Solo agenda en recepción.' },
    '🪑 Mesas do rooftop à noite?': { en: '🪑 Rooftop tables at night?', es: '🪑 ¿Mesas del rooftop por la noche?' },
    'Sim, inclusive após as 21h, sempre respeitando o silêncio.': { en: 'Yes, even after 9 PM, always keeping the noise down.', es: 'Sí, incluso después de las 21h, siempre respetando el silencio.' },
    '🚬 Onde é permitido fumar?': { en: '🚬 Where can I smoke?', es: '🚬 ¿Dónde se permite fumar?' },
    'Apenas na varanda ou próximo às janelas, sempre com respeito aos vizinhos.': { en: 'Only on the balcony or near the windows, always respecting your neighbors.', es: 'Solo en el balcón o cerca de las ventanas, siempre respetando a los vecinos.' },
    '💙 Obrigado por nos ajudar a manter um ambiente agradável para todos!': { en: '💙 Thank you for helping us keep a pleasant environment for everyone!', es: '💙 ¡Gracias por ayudarnos a mantener un ambiente agradable para todos!' },

    // check-out
    '🧳 Hora de ir embora? Antes de sair, deixe tudo prontinho para a próxima estadia. 😊': { en: '🧳 Time to go? Before you leave, get everything ready for the next stay. 😊', es: '🧳 ¿Hora de irte? Antes de salir, deja todo listo para la próxima estancia. 😊' },
    '🛁 Toalhas usadas': { en: '🛁 Used towels', es: '🛁 Toallas usadas' },
    'Deixe sobre o tampo do vaso sanitário (nunca no box do banho, pois pode danificar a estrutura).': { en: 'Leave them on the toilet lid (never on the shower stall, as it can damage the structure).', es: 'Déjalas sobre la tapa del inodoro (nunca en la ducha, pues puede dañar la estructura).' },
    '🏖️ Cadeiras de praia': { en: '🏖️ Beach chairs', es: '🏖️ Sillas de playa' },
    'Devolva limpas e no suporte suspenso.': { en: 'Return them clean and on the hanging rack.', es: 'Devuélvelas limpias y en el soporte suspendido.' },
    '🪟 Esquadrias e cortinas': { en: '🪟 Windows and curtains', es: '🪟 Ventanas y cortinas' },
    'Feche tudo e deixe as cortinas fechadas.': { en: 'Close everything and leave the curtains closed.', es: 'Cierra todo y deja las cortinas cerradas.' },
    '🍽️ Utensílios de cozinha': { en: '🍽️ Kitchen utensils', es: '🍽️ Utensilios de cocina' },
    'Deixe lavados e organizados.': { en: 'Leave them washed and organized.', es: 'Déjalos lavados y organizados.' },
    '🗑️ Lixo': { en: '🗑️ Trash', es: '🗑️ Basura' },
    'Entregue à colaboradora ou descarte no balde do subsolo.': { en: 'Hand it to the cleaning staff or dispose of it in the basement bin.', es: 'Entrégala a la colaboradora o desecha en el balde del subsuelo.' },
    '🎮 Controle da garagem': { en: '🎮 Garage remote', es: '🎮 Control del garaje' },
    'Deixe na prateleira da sala.': { en: 'Leave it on the living room shelf.', es: 'Déjalo en el estante de la sala.' },
    '🚪 Último passo': { en: '🚪 Last step', es: '🚪 Último paso' },
    'Confira se a porta ficou bem fechada e avise ao sair.': { en: 'Check that the door is properly closed and let us know when you leave.', es: 'Verifica que la puerta haya quedado bien cerrada y avisa al salir.' },
    'Observação importante — Toalhas.': { en: 'Important note — Towels.', es: 'Observación importante — Toallas.' },
    'As toalhas molhadas jamais devem ser deixadas penduradas no box do banho — isso pode danificar a estrutura e gerar prejuízo ao hóspede. Deixe-as exclusivamente sobre o tampo do vaso sanitário.': { en: 'Wet towels should never be left hanging in the shower stall — this can damage the structure and result in charges to the guest. Leave them exclusively on the toilet lid.', es: 'Las toallas mojadas nunca deben dejarse colgadas en la ducha — esto puede dañar la estructura y generar un perjuicio al huésped. Déjalas exclusivamente sobre la tapa del inodoro.' },
    'Obrigado por cuidar do nosso espaço! Foi um prazer receber você. 💙': { en: 'Thank you for taking care of our space! It was a pleasure hosting you. 💙', es: '¡Gracias por cuidar nuestro espacio! Fue un placer recibirte. 💙' },

    // localização
    '🌴 Onde fica o flat?': { en: '🌴 Where’s the flat located?', es: '🌴 ¿Dónde está el flat?' },
    'Endereço': { en: 'Address', es: 'Dirección' },
    'R. das Piscinas Naturais, 46 - Porto de Galinhas, Ipojuca - PE, 55590-000': { en: 'R. das Piscinas Naturais, 46 - Porto de Galinhas, Ipojuca - PE, 55590-000', es: 'R. das Piscinas Naturais, 46 - Porto de Galinhas, Ipojuca - PE, 55590-000' },
    '🧭 Vai usar o Waze?': { en: '🧭 Using Waze?', es: '🧭 ¿Vas a usar Waze?' },
    'É só clicar no botão abaixo! 😉': { en: 'Just tap the button below! 😉', es: '¡Solo haz clic en el botón de abajo! 😉' },
    'Abrir no Waze': { en: 'Open in Waze', es: 'Abrir en Waze' },
    'É longe de Recife?': { en: 'Is it far from Recife?', es: '¿Está lejos de Recife?' },
    'A Vila de Porto de Galinhas fica a cerca de 60 km de Recife (aproximadamente 1h de carro, dependendo do trânsito).': { en: 'The village of Porto de Galinhas is about 60 km (37 mi) from Recife (roughly a 1-hour drive, depending on traffic).', es: 'El pueblo de Porto de Galinhas está a unos 60 km de Recife (aproximadamente 1h en auto, dependiendo del tráfico).' },
    'Como é Porto de Galinhas?': { en: 'What’s Porto de Galinhas like?', es: '¿Cómo es Porto de Galinhas?' },
    'Durante o dia, a vila ganha vida com lojas, restaurantes e passeios. A maioria dos estabelecimentos funciona, em geral, das 11h às 23h.': { en: 'During the day, the village comes alive with shops, restaurants and tours. Most places are generally open from 11 AM to 11 PM.', es: 'Durante el día, el pueblo cobra vida con tiendas, restaurantes y paseos. La mayoría de los establecimientos funciona, en general, de 11h a 23h.' },
    'Agora é só aproveitar o sol, o mar e as belezas de Porto! 🌊😊': { en: 'Now just enjoy the sun, the sea and the beauty of Porto! 🌊😊', es: '¡Ahora solo disfruta del sol, el mar y las bellezas de Porto! 🌊😊' },

    // o que fazer
    'O que': { en: 'What to', es: 'Qué' },
    'fazer': { en: 'do', es: 'hacer' },
    '⭐ IMPERDÍVEL': { en: '⭐ MUST-DO', es: '⭐ IMPERDIBLE' },
    '🛶 Passeio de Jangada': { en: '🛶 Jangada Boat Trip', es: '🛶 Paseo en Jangada' },
    'Água mansa, morna e cristalina, peixinhos coloridos e corais. Cenário de cartão-postal.': { en: 'Calm, warm, crystal-clear water, colorful little fish and coral. A postcard-perfect setting.', es: 'Agua mansa, tibia y cristalina, peces de colores y corales. Un escenario de postal.' },
    '🚙 Passeio de Buggy': { en: '🚙 Buggy Tour', es: '🚙 Paseo en Buggy' },
    'Tour pelas praias: Pontal de Maracaípe, Maracaípe, Cupe e Muro Alto.': { en: 'A tour along the beaches: Pontal de Maracaípe, Maracaípe, Cupe and Muro Alto.', es: 'Recorrido por las playas: Pontal de Maracaípe, Maracaípe, Cupe y Muro Alto.' },
    '🤿 Mergulho com Cilindro': { en: '🤿 Scuba Diving', es: '🤿 Buceo con Cilindro' },
    'Para os aventureiros. Em média, 30 minutos de mergulho.': { en: 'For the adventurous. About 30 minutes of diving on average.', es: 'Para los aventureros. En promedio, 30 minutos de inmersión.' },
    'agito': { en: 'nightlife', es: 'ambiente' },
    '🏘️ Centro da Vila': { en: '🏘️ Village Center', es: '🏘️ Centro del Pueblo' },
    'Restaurantes, bares com música ao vivo e feirinha de artesanato.': { en: 'Restaurants, bars with live music and a craft market.', es: 'Restaurantes, bares con música en vivo y mercadillo de artesanía.' },
    '🚐 Transfer 24h': { en: '🚐 24h Transfer', es: '🚐 Transfer 24h' },
    'Traslados aeroporto/hotel e passeios. Consulte o anfitrião para indicação.': { en: 'Airport/hotel transfers and tours. Ask the host for a recommendation.', es: 'Traslados aeropuerto/hotel y paseos. Consulta al anfitrión para una recomendación.' },
    'As sugestões de passeios, transfers e serviços apresentadas neste guia são uma cortesia, selecionadas com base nas boas avaliações e experiências compartilhadas por nossos hóspedes. Elas não possuem caráter comercial, não representam recomendação exclusiva e não geram qualquer vínculo ou responsabilidade por parte do anfitrião.': { en: 'The tour, transfer and service suggestions in this guide are a courtesy, selected based on good reviews and experiences shared by our guests. They are not commercial in nature, do not represent an exclusive recommendation, and create no tie or liability for the host.', es: 'Las sugerencias de paseos, transfers y servicios presentadas en esta guía son una cortesía, seleccionadas con base en las buenas valoraciones y experiencias compartidas por nuestros huéspedes. No tienen carácter comercial, no representan una recomendación exclusiva y no generan ningún vínculo ni responsabilidad por parte del anfitrión.' },
    'Fique totalmente à vontade para realizar suas próprias pesquisas e escolher a opção que melhor atenda às suas preferências.': { en: 'Feel completely free to do your own research and choose the option that best suits your preferences.', es: 'Siéntete totalmente libre de hacer tu propia investigación y elegir la opción que mejor se adapte a tus preferencias.' },

    // onde comer
    'Onde': { en: 'Where to', es: 'Dónde' },
    'comer': { en: 'eat', es: 'comer' },
    'Domingos Restaurante': { en: 'Domingos Restaurante', es: 'Domingos Restaurante' },
    'Truta, salmão e lagosta, drinques e carta de vinhos.': { en: 'Trout, salmon and lobster, drinks and a wine list.', es: 'Trucha, salmón y langosta, bebidas y carta de vinos.' },
    'GIROSKKA-BAR': { en: 'GIROSKKA-BAR', es: 'GIROSKKA-BAR' },
    'desde 1994': { en: 'since 1994', es: 'desde 1994' },
    'Drinks, música ao vivo e vibe única. Das 10h às 3h.': { en: 'Drinks, live music and a unique vibe. From 10 AM to 3 AM.', es: 'Bebidas, música en vivo y un ambiente único. De 10h a 3h.' },
    'Café da Moeda': { en: 'Café da Moeda', es: 'Café da Moeda' },
    'Ótimo café da manhã e atendimento maravilhoso.': { en: 'Great breakfast and wonderful service.', es: 'Excelente desayuno y atención maravillosa.' },
    'Farol Café': { en: 'Farol Café', es: 'Farol Café' },
    'Na mesma rua do Di Maré. Café da manhã por consumo.': { en: 'On the same street as Di Maré. Pay-as-you-go breakfast.', es: 'En la misma calle del Di Maré. Desayuno pagado por consumo.' },
    'Ristorante Mamma Mia': { en: 'Ristorante Mamma Mia', es: 'Ristorante Mamma Mia' },
    'Pizza de massa fina e comida italiana.': { en: 'Thin-crust pizza and Italian food.', es: 'Pizza de masa fina y comida italiana.' },
    'Caldinho do Nenen': { en: 'Caldinho do Nenen', es: 'Caldinho do Nenen' },
    'Varanda à beira-mar e culinária de frutos do mar.': { en: 'Seaside veranda and seafood cuisine.', es: 'Terraza junto al mar y cocina de mariscos.' },
    'MaRdioca': { en: 'MaRdioca', es: 'MaRdioca' },
    'No coração de Porto. Cardápio variado e preço acessível.': { en: 'In the heart of Porto. A varied menu at an affordable price.', es: 'En el corazón de Porto. Carta variada y precio accesible.' },
    'Pousada Maihai': { en: 'Pousada Maihai', es: 'Pousada Maihai' },
    'café regional': { en: 'regional breakfast', es: 'desayuno regional' },
    'Frutas tropicais, sucos, omeletes e tapiocas.': { en: 'Tropical fruit, juices, omelets and tapiocas.', es: 'Frutas tropicales, jugos, tortillas y tapiocas.' },
    'Restaurante Beijupirá': { en: 'Restaurante Beijupirá', es: 'Restaurante Beijupirá' },
    'Pescados, camarão com mel de engenho e arroz com maracujá.': { en: 'Fish dishes, shrimp with cane honey and passion-fruit rice.', es: 'Pescados, camarón con miel de caña y arroz con maracuyá.' },
    'Estas são apenas algumas sugestões do anfitrião, escolhidas como uma cortesia e baseadas em boas experiências.': { en: 'These are just a few suggestions from the host, offered as a courtesy and based on good experiences.', es: 'Estas son solo algunas sugerencias del anfitrión, ofrecidas como cortesía y basadas en buenas experiencias.' },
    'Mas fique tranquilo(a): no centrinho da Vila você encontrará dezenas de restaurantes, bares e cafeterias para todos os gostos e bolsos. Afinal, em Porto de Galinhas é bem mais difícil escolher onde comer do que encontrar um bom lugar!': { en: 'But don’t worry: in the village center you’ll find dozens of restaurants, bars and cafés for every taste and budget. After all, in Porto de Galinhas it’s much harder to choose where to eat than to find a good place!', es: 'Pero quédate tranquilo(a): en el centrito del pueblo encontrarás decenas de restaurantes, bares y cafeterías para todos los gustos y bolsillos. Al final, en Porto de Galinhas es mucho más difícil elegir dónde comer que encontrar un buen lugar.' },

    // obrigado
    'Obrigado!': { en: 'Thank you!', es: '¡Gracias!' },
    'com carinho,': { en: 'with love,', es: 'con cariño,' },
    'Tenha uma': { en: 'Have a', es: 'Que tengas una' },
    'ótima estadia!': { en: 'wonderful stay!', es: '¡excelente estancia!' },
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
      // Hide the flag of the currently active language; show all others.
      b.style.display = isActive ? 'none' : '';
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

  function buildTopDockFlags() {
    // Populates the mobile top-dock's flag slot (app.js) — a single
    // persistent group living outside the page canvas, vs. one group
    // per page inserted by buildBar().
    const slot = document.querySelector('.top-dock-flags');
    if (!slot || slot.querySelector('.lang-flags')) return;
    slot.appendChild(makeGroup());
  }

  function init() {
    collect();
    buildBar();
    buildTopDockFlags();
    let saved = 'pt';
    try { saved = localStorage.getItem('guia-lang') || 'pt'; } catch (e) {}
    apply(saved);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
