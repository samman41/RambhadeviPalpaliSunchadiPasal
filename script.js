const CONFIG = {
    // Profile Details
    name: "Rambhadevi Palpali Sunchadi Pasal",
    title: "Established in 2075 B.S",

    // Paths to Images (Ensure these match the actual files in your directory)
    logoPath: "image/logo.png",
    backgroundPath: "image/background image.png",

    // Primary Action Buttons (Grid)
    actions: [
        { id: "call", label: "Call Now", url: "tel:+9779845434663", icon: "fas fa-phone-alt" },
        { id: "gmail", label: "Email Us", url: "mailto:contact@aavaran.com", icon: "fas fa-envelope" },
        { id: "location", label: "Location", url: "https://maps.app.goo.gl/UEfUks4VwjykiFGL6?g_st=ac", icon: "fas fa-map-marker-alt" },
        { id: "review", label: "Review Us", url: "https://search.google.com/local/writereview?placeid=ChIJ2Ul-PiT7lDkRhOARRQKrJu4", icon: "fas fa-star" }
    ],

    // Social Media Links (Small circular icons)
    socials: [
        { id: "instagram", url: "https://www.instagram.com/aavaranfashionattire?stkn=MW1uM3FpcGVsYjlhag%3D%3D", icon: "fab fa-instagram" },
        { id: "tiktok", url: "https://www.tiktok.com/@aavaranfashionattire?_r=1&_t=ZS-99aHiIzBITF", icon: "fab fa-tiktok" },
        { id: "facebook", url: "https://www.facebook.com/pratikshya.shrestha3", icon: "fab fa-facebook-f" }
    ],

    // Direct WhatsApp Link
    whatsappUrl: "whatsapp://send?phone=+9779845434663",

    // Save Contact (vCard) Details for Address Book
    vcard: {
        firstName: "Aavaran",
        lastName: "Fashion",
        phone: "+9779845434663",
        email: "[EMAIL_ADDRESS]",
        company: "Aavaran Fashion Attire",
        website: "https://www.instagram.com/aavaranfashionattire?stkn=MW1uM3FpcGVsYjlhag%3D%3D"
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // 1. Set Background and Logo
    document.getElementById('background-container').style.backgroundImage = `url('${CONFIG.backgroundPath}')`;
    document.getElementById('profile-logo').src = CONFIG.logoPath;

    // 2. Set Profile Information
    document.getElementById('profile-name').textContent = CONFIG.name;
    document.getElementById('profile-title').textContent = CONFIG.title;

    // 3. Generate Social Icons
    const socialsRow = document.getElementById('socials-row');
    CONFIG.socials.forEach(social => {
        const a = document.createElement('a');
        a.href = social.url;
        a.className = 'social-icon';
        a.target = '_blank';
        a.rel = 'noopener noreferrer';

        // Deep linking logic for Facebook
        if (social.id === 'facebook') {
            a.addEventListener('click', (e) => {
                e.preventDefault();
                const isAndroid = /Android/i.test(navigator.userAgent);
                const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);

                if (isAndroid) {
                    // Android intent with fallback
                    window.location.href = `intent://facewebmodal/f?href=${social.url}#Intent;package=com.facebook.katana;scheme=fb;S.browser_fallback_url=${encodeURIComponent(social.url)};end`;
                } else if (isIOS) {
                    // iOS app scheme with fallback
                    setTimeout(() => {
                        window.location.href = social.url;
                    }, 1500);
                    window.location.href = `fb://facewebmodal/f?href=${social.url}`;
                } else {
                    // Desktop
                    window.open(social.url, '_blank');
                }
            });
        }

        const i = document.createElement('i');
        i.className = social.icon;
        a.appendChild(i);

        socialsRow.appendChild(a);
    });

    // 4. Generate Action Grid Buttons
    const actionsGrid = document.getElementById('actions-grid');
    CONFIG.actions.forEach(action => {
        const a = document.createElement('a');
        a.href = action.url;
        a.className = 'action-btn';
        a.target = '_blank';
        a.rel = 'noopener noreferrer';

        const i = document.createElement('i');
        i.className = action.icon;

        const span = document.createElement('span');
        span.textContent = action.label;

        a.appendChild(i);
        a.appendChild(span);
        actionsGrid.appendChild(a);
    });

    // 5. Setup WhatsApp
    document.getElementById('whatsapp-btn').href = CONFIG.whatsappUrl;

    // 6. Handle 'Save Contact' Generation (vCard format)
    const saveBtn = document.getElementById('save-contact-btn');
    saveBtn.addEventListener('click', async (e) => {
        e.preventDefault();

        // Show a loading state if you wish
        const originalText = saveBtn.innerHTML;
        saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

        const v = CONFIG.vcard;

        // Fetch logo and convert to base64 for the vCard photo
        let base64Logo = "";
        try {
            const response = await fetch(CONFIG.logoPath);
            const blob = await response.blob();
            const reader = new FileReader();
            base64Logo = await new Promise((resolve, reject) => {
                reader.onloadend = () => {
                    const result = reader.result;
                    // Extract the base64 part from "data:image/jpeg;base64,..."
                    resolve(result.split(',')[1]);
                };
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        } catch (error) {
            console.error("Could not load logo for vCard photo:", error);
        }

        // Construct vCard 3.0 String
        const notes = "Boutique , Pratikshya Shrestha , Sari , Lehenga, kurtha";

        const vcardDataArray = [
            "BEGIN:VCARD",
            "VERSION:3.0",
            `N:${v.lastName};${v.firstName};;;`,
            `FN:${v.firstName} ${v.lastName}`,
            `ORG:${v.company}`,
            `TEL;TYPE=WORK,VOICE:${v.phone}`,
            `EMAIL;TYPE=PREF,INTERNET:${v.email}`,
            `URL:${v.website}`,
            `URL:${CONFIG.whatsappUrl}`
        ];

        // Add socials as clickable websites and social profiles in the contact
        CONFIG.socials.forEach(s => {
            vcardDataArray.push(`URL:${s.url}`);

            // Map social IDs to vCard types
            let socialType = s.id.toLowerCase();
            if (socialType === 'instagram' || socialType === 'tiktok' || socialType === 'facebook') {
                vcardDataArray.push(`X-SOCIALPROFILE;TYPE=${socialType}:${s.url}`);
            }
        });

        // Add other action locations/links (like Location) to the vCard
        CONFIG.actions.forEach(a => {
            if (a.url && !a.url.startsWith('tel:') && !a.url.startsWith('mailto:')) {
                vcardDataArray.push(`URL:${a.url}`);
            }
        });

        vcardDataArray.push(`NOTE:${notes}`);

        if (base64Logo) {
            // Check logo path extension to determine type roughly, default to JPEG
            const isPng = CONFIG.logoPath.toLowerCase().endsWith('.png');
            const photoType = isPng ? 'PNG' : 'JPEG';
            // Fold the base64 string if necessary, but most modern readers accept it on one line.
            // Using standard vCard 3.0 PHOTO format:
            vcardDataArray.push(`PHOTO;ENCODING=b;TYPE=${photoType}:${base64Logo}`);
        }

        vcardDataArray.push("END:VCARD");

        const vcardData = vcardDataArray.join("\r\n");

        // Trigger file download
        const blob = new Blob([vcardData], { type: "text/vcard;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = `${v.firstName}_${v.lastName}.vcf`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        URL.revokeObjectURL(url);

        // Restore button text
        saveBtn.innerHTML = originalText;
    });

    // 7. Scroll Animation
    window.addEventListener('scroll', () => {
        const header = document.getElementById('hero-header');
        if (window.scrollY > 30) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // 8. Scroll Down Indicator Click
    const scrollIndicator = document.getElementById('scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            window.scrollTo({
                top: window.innerHeight * 0.8,
                behavior: 'smooth'
            });
        });
    }
});
