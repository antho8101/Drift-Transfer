export type Language = "en" | "fr";

export const languages: Array<{ code: Language; label: string }> = [
  { code: "en", label: "EN" },
  { code: "fr", label: "FR" }
];

export const dictionaries = {
  en: {
    common: {
      github: "GitHub",
      sponsor: "Donate",
      footer:
        "Made with ❤ by Anthony. Free, open source, no accounts.",
      powered: "Browser-to-browser powered",
      operaGxWarningBeforeChrome:
        "Opera GX may block the private transfer link. For the best experience, use",
      chrome: "Chrome",
      operaGxWarningAfterChrome: "instead."
    },
    start: {
      idle: "Start transfer",
      loading: "Opening room..."
    },
    home: {
      navHow: "How it works",
      navOpenSource: "Open source",
      badge: "✨ 100% free, no account, direct transfer",
      title: "Big files. Tiny effort. Pure browser magic.",
      intro:
        "Drift Transfer is the no-account file drop your group chat wishes it had. Open a room, share the link, and let the file glide from one browser to another, even from iPhone to Windows. No cloud upload detour, no account wall.",
      support: "Donate to the project",
      chips: ["⚡ Direct browser link", "📱 iPhone to Windows friendly", "🔒 No server storage", "🌍 Open source"],
      crossDevice: {
        eyebrow: "📱 Cross-device transfer",
        title: "iPhone to Windows should not feel like a side quest.",
        text:
          "Need to move photos, videos, PDFs, or project files from an iPhone to a Windows PC? Drift Transfer works through the browser, so it also covers those Apple-to-Microsoft moments without installing another sync app.",
        source: "iPhone",
        destination: "Windows PC",
        note: "Also works with Mac, Android, Linux, tablets, and any modern browser."
      },
      mockRoom: "🚀 Live room",
      mockTitle: "Secure device link, vibes included",
      connected: "✅ Connected",
      mockFile: "🌊 The file is gliding directly between devices.",
      features: [
        {
          icon: "✨",
          title: "Free forever",
          description:
            "No account, no pricing page, no weird hoops. Just open a room and send."
        },
        {
          icon: "🌊",
          title: "Direct by design",
          description:
            "Your browser creates a private link with the other device, then the file glides across."
        },
        {
          icon: "🔒",
          title: "No storage",
          description:
            "Your files do not hang out on a server. They drift straight to the other browser."
        }
      ],
      featureMockups: [
        {
          label: "Open room",
          title: "$0 forever",
          detail: "No account wall"
        },
        {
          label: "Browser link",
          title: "Device A → Device B",
          detail: "Private direct path"
        },
        {
          label: "Storage",
          title: "Skipped",
          detail: "Nothing parked on a server"
        }
      ],
      howEyebrow: "🧭 How it works",
      howTitle: "A tiny handshake, then the fun part.",
      howText:
        "Drift Transfer creates a temporary room, connects both browsers, then sends the file in small chunks directly to the other device. You get a smooth transfer without creating an account.",
      steps: [
        "🚪 Start a room",
        "🔗 Share the invite link",
        "📦 Drop a file",
        "⬇️ Download on the other device"
      ],
      flowMockup: {
        room: "Room ready",
        invite: "Invite copied",
        transfer: "Transfer live",
        done: "Download ready"
      },
      openSourceEyebrow: "🌍 Open source",
      openSourceTitle:
        "Built in public. Free because the internet is better that way.",
      openSourceText:
        "Drift Transfer is a public GitHub project by Anthony Carayon. PRs, bug reports, design polish, and thoughtful product ideas are welcome. If this saves you a headache, a donation keeps the lights glowing.",
      anthonyGithub: "Anthony on GitHub",
      sponsorWork: "Donate",
      repoMockup: {
        title: "Drift-Transfer",
        visibility: "Public repository",
        stars: "Open source",
        issue: "Good first ideas welcome",
        branch: "main"
      },
      qaMockups: [
        { label: "Storage check", status: "Clear" },
        { label: "Account check", status: "Clear" }
      ],
      faq: [
        {
          title: "Does Drift Transfer upload files?",
          text:
            "No. Files move directly between browsers. Drift Transfer does not store uploaded files on an app server."
        },
        {
          title: "Is an account required?",
          text:
            "Nope. Start a room, share the link, send the file. No signup and no user database."
        },
        {
          title: "Can it handle large files?",
          text:
            "Yes. Files are split into chunks and sent with progress updates on both devices."
        }
      ]
    },
    how: {
      back: "Back",
      eyebrow: "🧭 How it works",
      title: "A private room, a direct link, and your file glides across.",
      intro:
        "Drift Transfer keeps the experience simple. You create a room, invite one other device, choose files, and send them directly from browser to browser.",
      steps: [
        ["1", "Open a room", "A short private room link is created instantly."],
        ["2", "Invite one device", "Send the link or scan the QR code from the second device."],
        ["3", "Verify the code", "Both screens show the same short verification phrase."],
        ["4", "Send files", "Files are split into chunks and sent directly with live progress."],
        ["5", "Download locally", "The receiver rebuilds the files in the browser and downloads them."],
        ["6", "Nothing stored", "No account, no database, no server-side file storage."]
      ]
    },
    room: {
      preparing: "Preparing room...",
      receiving: "Receiving file...",
      complete: "Transfer complete",
      checksumMismatch: "Transfer complete, checksum mismatch",
      secureLink: "Secure device link established",
      channelError: "The file channel reported an error.",
      connecting: "Connecting to the other device...",
      publishIceError: "Could not publish an ICE candidate.",
      interrupted: "Device link interrupted",
      fullEnter: "This room already has two devices. Ask extra visitors to close the tab.",
      fullStatus: "Room already has two devices",
      fullError: "This transfer room is full. Start a fresh room to send files.",
      waitingDevice: "Waiting for another device...",
      joining: "Joining device link...",
      answering: "Answering device link...",
      setupFailed: "Room setup failed",
      setupError: "Could not initialize the room.",
      realtimeError:
        "Could not reach the realtime service. Check the Ably environment variable on Vercel, then refresh both devices.",
      transferFailed: "Transfer failed",
      transferError: "The transfer could not be completed.",
      connectionBlocked: "Private link blocked",
      connectionBlockedHelp:
        "The realtime room is open, but the browser could not create the private device link. Disable VPN/ad blocking/WebRTC protection, or try a browser with WebRTC enabled.",
      processingDownload: "Preparing download...",
      processingDownloadHelp: "Rebuilding and checking the file before download.",
      filesReadyWaiting: "Files ready. Waiting for another device...",
      filesReadyPlural: "Files ready to send",
      filesReadySingular: "File ready to send",
      heading: "Invite a friend. Let the file drift.",
      description:
        "Share this link with exactly one other device. We set up the private browser link, then your file moves directly across.",
      thisDevice: "🎛️ This device",
      sendingMode: "Sending mode",
      receivingMode: "Receiving mode",
      sendingDescription: "This device is set to choose files and send them.",
      receivingDescription: "This device is set to wait for incoming files.",
      firstDevice: "This browser opened the room first, so it starts the private link.",
      secondDevice: "This browser joined second, so it waits for the private link.",
      detectingOrder: "Detecting the room order...",
      switchTo: "Switch to",
      send: "send",
      receive: "receive",
      inviteLink: "Invite link",
      preparingLink: "Preparing link...",
      copied: "Copied. Go make magic.",
      copyInvite: "Copy invite link",
      inviteAlternative: "or",
      verify: "🧬 Verify both devices",
      verifyText: "Both screens should show the same code before you send anything sensitive.",
      yourRole: "🎭 Your role",
      sendRole: "Send",
      receiveRole: "Receive",
      fileChannel: "⚡ File channel",
      openReady: "Open and ready",
      warmingUp: "Warming up",
      tip: "💡 Pro tip: keep both tabs open until the transfer is done. No tab, no tunnel.",
      history: "🕘 Local history",
      sentDirection: "sent",
      receivedDirection: "received",
      transferDeck: "🌊 Transfer deck",
      completeTitle: "Transfer complete. Smooth landing.",
      receiveTitle: "Ready to catch the drop",
      sendTitle: "Drop it here and ship it",
      receiveHelper: "Relax. The incoming file will show up here when it drifts in.",
      receivePanelEyebrow: "Receive mode",
      receivePanelTitle: "This device is waiting for incoming files.",
      receivePanelText:
        "No file drop needed here. Keep this tab open and the sender can ship files to you directly.",
      receivePanelSwitch: "Want to send instead?",
      receivePanelButton: "Switch to send mode",
      sendHelperLive: "Drop files or click Choose files. We are live.",
      sendHelperWaiting: "Choose files now. Send unlocks when the other device connects.",
      sendButton: "Woosh, send files",
      sendLocked: "Files already sent",
      waitingLink: "Waiting for device link...",
      sendingFile: "Sending file...",
      waitingDrop: "Waiting for the drop...",
      speed: "Speed",
      waiting: "Waiting",
      eta: "ETA",
      ready: "Ready",
      check: "Check",
      verified: "Verified",
      mismatch: "Mismatch",
      pending: "Pending",
      file: "File",
      download: "Download",
      downloadAll: "Download everything as a ZIP",
      preparingArchive: "Preparing ZIP...",
      openDownloads: "Open downloads",
      downloadReadyTitle: "Your file landed",
      downloadReadyText:
        "The transfer is complete. Download it now while this tab is open.",
      close: "Close",
      checkFailed: "Check failed",
      filesSelected: "files selected"
    },
    drop: {
      drag: "Drop to drift",
      idle: "Drop your files here",
      waiting: "Waiting for the other device.",
      helper: "Drop files or click to choose.",
      choose: "Choose files"
    },
    qr: {
      title: "Scan invite",
      description: "Open QR code for a phone or nearby device",
      show: "Show",
      hide: "Hide",
      loading: "Preparing QR code...",
      alt: "QR code for the invite link"
    },
    forbidden: {
      badge: "🔒 Access paused",
      title: "This room is not yours to enter.",
      text:
        "Looks like this link is private, expired, or simply not meant for this device. No drama. Start a fresh transfer room and get back to sending files in a few seconds.",
      start: "Start a new transfer",
      viewGithub: "View on GitHub",
      privateLink: "Private link",
      failed: "Access check failed",
      locked: "Locked",
      permission: "Room permission",
      denied: "Denied",
      tip: "💡 Tip: ask the sender for a fresh invite link, or create a new room from the homepage."
    }
  },
  fr: {
    common: {
      github: "GitHub",
      sponsor: "Faire un don",
      footer:
        "Made with ❤ by Anthony. Gratuit, open source, sans compte.",
      powered: "Propulsé de navigateur à navigateur",
      operaGxWarningBeforeChrome:
        "Opera GX peut bloquer le lien privé de transfert. Pour une meilleure expérience, utilise",
      chrome: "Chrome",
      operaGxWarningAfterChrome: "à la place."
    },
    start: {
      idle: "Démarrer un transfert",
      loading: "Ouverture de la room..."
    },
    home: {
      navHow: "Comment ça marche",
      navOpenSource: "Open source",
      badge: "✨ 100% gratuit, sans compte, transfert direct",
      title: "Gros fichiers. Petit effort. Pure magie navigateur.",
      intro:
        "Drift Transfer, c’est le dépôt de fichiers sans compte que ton groupe attendait. Ouvre une room, partage le lien, et laisse le fichier glisser d’un navigateur à l’autre, même d’un iPhone vers Windows. Pas de détour cloud, pas de mur de connexion.",
      support: "Faire un don",
      chips: ["⚡ Lien direct navigateur", "📱 iPhone vers Windows", "🔒 Aucun stockage serveur", "🌍 Open source"],
      crossDevice: {
        eyebrow: "📱 Transfert entre appareils",
        title: "iPhone vers Windows ne devrait pas être une quête secondaire.",
        text:
          "Besoin de déplacer des photos, vidéos, PDF ou fichiers de projet d’un iPhone vers un PC Windows ? Drift Transfer passe par le navigateur, donc il couvre aussi ces moments Apple vers Microsoft sans installer une nouvelle app de synchro.",
        source: "iPhone",
        destination: "PC Windows",
        note: "Fonctionne aussi avec Mac, Android, Linux, tablettes et tout navigateur moderne."
      },
      mockRoom: "🚀 Room live",
      mockTitle: "Lien privé établi, vibes incluses",
      connected: "✅ Connecté",
      mockFile: "🌊 Le fichier glisse directement entre les appareils.",
      features: [
        {
          icon: "✨",
          title: "Gratuit pour toujours",
          description:
            "Pas de compte, pas de page pricing, pas d’étapes bizarres. Ouvre une room et envoie."
        },
        {
          icon: "🌊",
          title: "Direct par nature",
          description:
            "Ton navigateur crée un lien privé avec l’autre appareil, puis le fichier glisse entre les deux."
        },
        {
          icon: "🔒",
          title: "Aucun stockage",
          description:
            "Tes fichiers ne patientent pas sur un serveur. Ils dérivent directement vers l’autre navigateur."
        }
      ],
      featureMockups: [
        {
          label: "Ouvrir une room",
          title: "0 € pour toujours",
          detail: "Aucun mur de compte"
        },
        {
          label: "Lien navigateur",
          title: "Appareil A → Appareil B",
          detail: "Chemin direct privé"
        },
        {
          label: "Stockage",
          title: "Évité",
          detail: "Rien ne reste sur serveur"
        }
      ],
      howEyebrow: "🧭 Comment ça marche",
      howTitle: "Une mini poignée de main, puis la partie fun.",
      howText:
        "Drift Transfer crée une room temporaire, connecte les deux navigateurs, puis envoie le fichier en petits morceaux directement vers l’autre appareil. Tout ça sans créer de compte.",
      steps: [
        "🚪 Ouvre une room",
        "🔗 Partage le lien d’invitation",
        "📦 Dépose un fichier",
        "⬇️ Télécharge sur l’autre appareil"
      ],
      flowMockup: {
        room: "Room prête",
        invite: "Invitation copiée",
        transfer: "Transfert live",
        done: "Téléchargement prêt"
      },
      openSourceEyebrow: "🌍 Open source",
      openSourceTitle:
        "Construit en public. Gratuit parce qu’internet est mieux comme ça.",
      openSourceText:
        "Drift Transfer est un projet GitHub public par Anthony Carayon. PR, bugs, polish design et bonnes idées produit sont les bienvenus. Si ça t’évite une galère, un petit don garde les lumières allumées.",
      anthonyGithub: "Anthony sur GitHub",
      sponsorWork: "Faire un don",
      repoMockup: {
        title: "Drift-Transfer",
        visibility: "Dépôt public",
        stars: "Open source",
        issue: "Bonnes idées bienvenues",
        branch: "main"
      },
      qaMockups: [
        { label: "Contrôle stockage", status: "OK" },
        { label: "Contrôle compte", status: "OK" }
      ],
      faq: [
        {
          title: "Drift Transfer upload les fichiers ?",
          text:
            "Non. Les fichiers passent directement entre navigateurs. Drift Transfer ne stocke pas les fichiers sur un serveur applicatif."
        },
        {
          title: "Un compte est nécessaire ?",
          text:
            "Nope. Ouvre une room, partage le lien, envoie le fichier. Pas d’inscription, pas de base utilisateur."
        },
        {
          title: "Ça gère les gros fichiers ?",
          text:
            "Oui. Les fichiers sont découpés en morceaux et envoyés avec une progression visible sur les deux appareils."
        }
      ]
    },
    how: {
      back: "Retour",
      eyebrow: "🧭 Comment ça marche",
      title: "Une room privée, un lien direct, et ton fichier glisse.",
      intro:
        "Drift Transfer garde l’expérience simple. Tu crées une room, invites un autre appareil, choisis tes fichiers, et les envoies directement de navigateur à navigateur.",
      steps: [
        ["1", "Ouvre une room", "Un lien privé court est créé instantanément."],
        ["2", "Invite un appareil", "Envoie le lien ou scanne le QR code depuis le second appareil."],
        ["3", "Vérifie le code", "Les deux écrans affichent la même phrase de vérification courte."],
        ["4", "Envoie les fichiers", "Les fichiers sont découpés et envoyés directement avec une progression live."],
        ["5", "Télécharge localement", "Le destinataire reconstruit les fichiers dans le navigateur et les télécharge."],
        ["6", "Rien n’est stocké", "Pas de compte, pas de base de données, pas de stockage serveur."]
      ]
    },
    room: {
      preparing: "Préparation de la room...",
      receiving: "Réception du fichier...",
      complete: "Transfert terminé",
      checksumMismatch: "Transfert terminé, vérification différente",
      secureLink: "Lien privé établi",
      channelError: "Le canal fichier a signalé une erreur.",
      connecting: "Connexion à l’autre appareil...",
      publishIceError: "Impossible de publier un candidat de connexion.",
      interrupted: "Lien entre appareils interrompu",
      fullEnter: "Cette room a déjà deux appareils. Demande aux visiteurs en trop de fermer l’onglet.",
      fullStatus: "La room a déjà deux appareils",
      fullError: "Cette room de transfert est pleine. Démarre une nouvelle room pour envoyer des fichiers.",
      waitingDevice: "En attente d’un autre appareil...",
      joining: "Connexion au lien privé...",
      answering: "Réponse au lien privé...",
      setupFailed: "Initialisation impossible",
      setupError: "Impossible d’initialiser la room.",
      realtimeError:
        "Impossible de joindre le service temps réel. Vérifie la variable Ably sur Vercel, puis recharge les deux appareils.",
      transferFailed: "Échec du transfert",
      transferError: "Le transfert n’a pas pu être terminé.",
      connectionBlocked: "Lien privé bloqué",
      connectionBlockedHelp:
        "La room temps réel est ouverte, mais le navigateur n’a pas réussi à créer le lien privé entre appareils. Désactive VPN, bloqueur de pubs/protection WebRTC, ou essaye un navigateur avec WebRTC actif.",
      processingDownload: "Préparation du téléchargement...",
      processingDownloadHelp: "Reconstruction et vérification du fichier avant téléchargement.",
      filesReadyWaiting: "Fichiers prêts. En attente d’un autre appareil...",
      filesReadyPlural: "Fichiers prêts à envoyer",
      filesReadySingular: "Fichier prêt à envoyer",
      heading: "Invite un ami. Laisse le fichier dériver.",
      description:
        "Partage ce lien avec un seul autre appareil. On prépare le lien privé, puis ton fichier part directement.",
      thisDevice: "🎛️ Cet appareil",
      sendingMode: "Mode envoi",
      receivingMode: "Mode réception",
      sendingDescription: "Cet appareil est prêt à choisir et envoyer des fichiers.",
      receivingDescription: "Cet appareil attend les fichiers entrants.",
      firstDevice: "Ce navigateur a ouvert la room en premier, il initialise le lien privé.",
      secondDevice: "Ce navigateur est arrivé en second, il attend le lien privé.",
      detectingOrder: "Détection de l’ordre dans la room...",
      switchTo: "Passer en",
      send: "envoi",
      receive: "réception",
      inviteLink: "Lien d’invitation",
      preparingLink: "Préparation du lien...",
      copied: "Copié. À toi la magie.",
      copyInvite: "Copier le lien d’invitation",
      inviteAlternative: "ou",
      verify: "🧬 Vérifier les deux appareils",
      verifyText: "Les deux écrans doivent afficher le même code avant d’envoyer un fichier sensible.",
      yourRole: "🎭 Ton rôle",
      sendRole: "Envoyer",
      receiveRole: "Recevoir",
      fileChannel: "⚡ Canal fichier",
      openReady: "Ouvert et prêt",
      warmingUp: "Préparation",
      tip: "💡 Astuce : garde les deux onglets ouverts jusqu’à la fin du transfert. Pas d’onglet, pas de tunnel.",
      history: "🕘 Historique local",
      sentDirection: "envoyé",
      receivedDirection: "reçu",
      transferDeck: "🌊 Zone de transfert",
      completeTitle: "Transfert terminé. Atterrissage tout doux.",
      receiveTitle: "Prêt à réceptionner",
      sendTitle: "Dépose ici et envoie",
      receiveHelper: "Relax. Le fichier entrant apparaîtra ici quand il arrive.",
      receivePanelEyebrow: "Mode réception",
      receivePanelTitle: "Cet appareil attend les fichiers entrants.",
      receivePanelText:
        "Pas besoin de zone de dépôt ici. Garde cet onglet ouvert et l’envoyeur pourra t’envoyer les fichiers directement.",
      receivePanelSwitch: "Tu veux envoyer à la place ?",
      receivePanelButton: "Passer en mode envoi",
      sendHelperLive: "Dépose des fichiers ou clique sur Choisir. C’est prêt.",
      sendHelperWaiting: "Choisis les fichiers maintenant. L’envoi se débloque quand l’autre appareil se connecte.",
      sendButton: "Woosh, envoyer les fichiers",
      sendLocked: "Fichiers déjà envoyés",
      waitingLink: "En attente du lien appareil...",
      sendingFile: "Envoi du fichier...",
      waitingDrop: "En attente du fichier...",
      speed: "Vitesse",
      waiting: "Attente",
      eta: "ETA",
      ready: "Prêt",
      check: "Contrôle",
      verified: "Vérifié",
      mismatch: "Différent",
      pending: "En attente",
      file: "Fichier",
      download: "Télécharger",
      downloadAll: "Tout télécharger en ZIP",
      preparingArchive: "Préparation du ZIP...",
      openDownloads: "Ouvrir les téléchargements",
      downloadReadyTitle: "Ton fichier est arrivé",
      downloadReadyText:
        "Le transfert est terminé. Télécharge-le maintenant tant que cet onglet est ouvert.",
      close: "Fermer",
      checkFailed: "Échec du contrôle",
      filesSelected: "fichiers sélectionnés"
    },
    drop: {
      drag: "Dépose pour faire dériver",
      idle: "Dépose tes fichiers ici",
      waiting: "En attente de l’autre appareil.",
      helper: "Dépose des fichiers ou clique pour choisir.",
      choose: "Choisir des fichiers"
    },
    qr: {
      title: "Scanner l’invitation",
      description: "Ouvrir le QR code pour un téléphone ou un appareil proche",
      show: "Afficher",
      hide: "Masquer",
      loading: "Préparation du QR code...",
      alt: "QR code du lien d’invitation"
    },
    forbidden: {
      badge: "🔒 Accès en pause",
      title: "Cette room n’est pas à toi.",
      text:
        "Ce lien semble privé, expiré, ou simplement pas prévu pour cet appareil. Aucun drama. Démarre une nouvelle room et reprends l’envoi en quelques secondes.",
      start: "Démarrer un nouveau transfert",
      viewGithub: "Voir sur GitHub",
      privateLink: "Lien privé",
      failed: "Vérification d’accès échouée",
      locked: "Verrouillé",
      permission: "Permission de la room",
      denied: "Refusé",
      tip: "💡 Astuce : demande un nouveau lien d’invitation à l’envoyeur, ou crée une nouvelle room depuis l’accueil."
    }
  }
} as const;

export type Dictionary = (typeof dictionaries)[Language];
