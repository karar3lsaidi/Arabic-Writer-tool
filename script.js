document.addEventListener('DOMContentLoaded', () => {

    document.getElementById('year').textContent = new Date().getFullYear();

    // Dark mode functionality
    const toggleSwitch = document.querySelector('#checkbox');
    const currentTheme = localStorage.getItem('theme');

    if (currentTheme) {
        document.documentElement.setAttribute('data-theme', currentTheme);
        if (currentTheme === 'dark') {
            toggleSwitch.checked = true;
        }
    }

    function switchTheme(e) {

        const body = document.body;
        body.style.transition = 'background-color 0.5s ease';
        

        const overlay = document.createElement('div');
        overlay.style.position = 'fixed';
        overlay.style.top = '0';
        overlay.style.left = '0';
        overlay.style.width = '100%';
        overlay.style.height = '100%';
        overlay.style.backgroundColor = e.target.checked ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)';
        overlay.style.transition = 'opacity 0.5s ease';
        overlay.style.pointerEvents = 'none';
        overlay.style.zIndex = '9999';
        document.body.appendChild(overlay);


        document.documentElement.setAttribute('data-theme', e.target.checked ? 'dark' : 'light');
        localStorage.setItem('theme', e.target.checked ? 'dark' : 'light');


        setTimeout(() => {
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.remove();
            }, 500);
        }, 50);
    }

    toggleSwitch.addEventListener('change', switchTheme);

    // Text conversion functionality
    const inputText = document.querySelector('#inputText');
    const outputText = document.querySelector('#outputText');
    const copyBtn = document.querySelector('#copyBtn');
    const clearBtn = document.querySelector('#clearBtn');
    const charCount = document.querySelector('#charCount');
    const wordCount = document.querySelector('#wordCount');

    // Define character sets
    const left = "ٹہےگڤچپـئظشسيبلتنمكطضصثقفغعهخحج";
    const right = "ٹہےڈڑگڤژچپـئؤرلالآىآةوزظشسيبللأاأتنمكطضصثقفغعهخحجدذلإإۇۆۈ";
    const harakat = "ًٌٍَُِّْ";
    const symbols = "ـ.،؟ @#$%^&*-+|/=~,:";
    
    // Unicode mapping for Arabic characters
    const unicode = 
        "ﺁ ﺁ ﺂ ﺂ "+"ﺃ ﺃ ﺄ ﺄ "+"ﺇ ﺇ ﺈ ﺈ "+"ﺍ ﺍ ﺎ ﺎ "+"ﺏ ﺑ ﺒ ﺐ "+"ﺕ ﺗ ﺘ ﺖ "+"ﺙ ﺛ ﺜ ﺚ "+"ﺝ ﺟ ﺠ ﺞ "+"ﺡ ﺣ ﺤ ﺢ "+"ﺥ ﺧ ﺨ ﺦ "+
        "ﺩ ﺩ ﺪ ﺪ "+"ﺫ ﺫ ﺬ ﺬ "+"ﺭ ﺭ ﺮ ﺮ "+"ﺯ ﺯ ﺰ ﺰ "+"ﺱ ﺳ ﺴ ﺲ "+"ﺵ ﺷ ﺸ ﺶ "+"ﺹ ﺻ ﺼ ﺺ "+"ﺽ ﺿ ﻀ ﺾ "+"ﻁ ﻃ ﻄ ﻂ "+"ﻅ ﻇ ﻈ ﻆ "+
        "ﻉ ﻋ ﻌ ﻊ "+"ﻍ ﻏ ﻐ ﻎ "+"ﻑ ﻓ ﻔ ﻒ "+"ﻕ ﻗ ﻘ ﻖ "+"ﻙ ﻛ ﻜ ﻚ "+"ﻝ ﻟ ﻠ ﻞ "+"ﻡ ﻣ ﻤ ﻢ "+"ﻥ ﻧ ﻨ ﻦ "+"ﻩ ﻫ ﻬ ﻪ "+"ﻭ ﻭ ﻮ ﻮ "+
        "ﻱ ﻳ ﻴ ﻲ "+"ﺓ ﺓ ﺔ ﺔ "+"ﺅ ﺅ ﺆ ﺆ "+"ﺉ ﺋ ﺌ ﺊ "+"ﻯ ﻯ ﻰ ﻰ "+"ﭖ ﭘ ﭙ ﭗ "+"ﭺ ﭼ ﭽ ﭻ "+"ﮊ ﮊ ﮋ ﮋ "+"ﭪ ﭬ ﭭ ﭫ "+"ﮒ ﮔ ﮕ ﮓ "+
        "ﭦ ﭨ ﭩ ﭧ "+"ﮦ ﮨ ﮩ ﮧ "+"ﮮ ﮰ ﮱ ﮯ "+"ﮈ ﮈ ﮉ ﮉ "+"ﮌ ﮌ ﮍ ﮍ "+"ﯗ ﯗ ﯘ ﯘ "+"ﯙ ﯙ ﯚ ﯚ "+"ﯛ ﯛ ﯜ ﯜ "+
        "ﻵ ﻵ ﻶ ﻶ "+"ﻷ ﻷ ﻸ ﻸ "+"ﻹ ﻹ ﻺ ﻺ "+"ﻻ ﻻ ﻼ ﻼ ";

    const arabic = 
        "آ"+"أ"+"إ"+"ا"+"ب"+"ت"+"ث"+"ج"+"ح"+"خ"+
        "د"+"ذ"+"ر"+"ز"+"س"+"ش"+"ص"+"ض"+"ط"+"ظ"+
        "ع"+"غ"+"ف"+"ق"+"ك"+"ل"+"م"+"ن"+"ه"+"و"+
        "ي"+"ة"+"ؤ"+"ئ"+"ى"+"پ"+"چ"+"ژ"+"ڤ"+"گ"+
        "ٹ"+"ہ"+"ے"+"ڈ"+"ڑ"+"ۇ"+"ۆ"+"ۈ";

    const notEng = arabic + harakat + "ء،؟";
    const brackets = "(){}[]";
    const laIndex = 8 * 48;


    function updateTextStats(text) {

        const chars = text.replace(/[\س\u064B-\u065F]/g, '').length;
        charCount.textContent = chars + (chars === 1 ? ' حرف' : ' حرف');


        const words = text.trim().split(/\s+/).filter(word => word.length > 0).length;
        wordCount.textContent = words + (words === 1 ? ' كلمة' : ' كلمة');
    }

    // Convert text function with optimization
    function convertArabicText(text) {
        if (!text) return '';

        let result = '';
        const lines = text.split(/\r?\n/);
        
        return lines.map(line => {
            const chars = Array.from(line);
            let lineResult = '';
            
            for (let i = 0; i < chars.length; i++) {
                let pos = 0;
                let a = 1, b = 1;

                while (harakat.indexOf(chars[i - b]) >= 0) b++;
                while (harakat.indexOf(chars[i + a]) >= 0) a++;

                if (i === 0) {
                    pos = right.indexOf(chars[a]) >= 0 ? 2 : 0;
                } else if (i === chars.length - 1) {
                    pos = left.indexOf(chars[chars.length - b - 1]) >= 0 ? 6 : 0;
                } else {
                    if (left.indexOf(chars[i - b]) < 0) {
                        pos = right.indexOf(chars[i + a]) < 0 ? 0 : 2;
                    } else {
                        pos = right.indexOf(chars[i + a]) >= 0 ? 4 : 6;
                    }
                }

                if (chars[i] === "ء") {
                    lineResult = "ﺀ" + lineResult;
                } else if (brackets.indexOf(chars[i]) >= 0) {
                    const idx = brackets.indexOf(chars[i]);
                    lineResult = brackets.charAt(idx % 2 === 0 ? idx + 1 : idx - 1) + lineResult;
                } else if (arabic.indexOf(chars[i]) >= 0) {
                    if (chars[i] === "ل") {
                        const nextChar = chars[i + 1];
                        const arPos = arabic.indexOf(nextChar);
                        if (arPos >= 0 && arPos < 4) {
                            lineResult = unicode.charAt((arPos * 8) + pos + laIndex) + lineResult;
                            i++;
                        } else {
                            lineResult = unicode.charAt((arabic.indexOf(chars[i]) * 8) + pos) + lineResult;
                        }
                    } else {
                        lineResult = unicode.charAt((arabic.indexOf(chars[i]) * 8) + pos) + lineResult;
                    }
                } else if (symbols.indexOf(chars[i]) >= 0 || harakat.indexOf(chars[i]) >= 0) {
                    lineResult = chars[i] + lineResult;
                } else {
                    let engText = '';
                    while (i < chars.length && 
                           notEng.indexOf(chars[i]) < 0 && 
                           unicode.indexOf(chars[i]) < 0 && 
                           brackets.indexOf(chars[i]) < 0) {
                        engText += chars[i];
                        i++;
                    }
                    i--;
                    lineResult = engText + lineResult;
                }
            }
            return lineResult;
        }).join('\n');
    }

    // Debounce function for performance
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }


    const updateOutput = debounce((input) => {
        const convertedText = convertArabicText(input);
        outputText.value = convertedText;
        updateTextStats(input);
        

        clearBtn.disabled = !input.length;
        clearBtn.style.opacity = input.length ? '1' : '0.6';
        copyBtn.disabled = !convertedText.length;
    }, 150);

    inputText.addEventListener('input', (e) => updateOutput(e.target.value));


    function showNotification(message, type = 'success') {
        const notification = document.getElementById('notification');
        const icon = type === 'success' ? 'check-circle' : 'exclamation-circle';
        
        notification.innerHTML = `
            <i class="fas fa-${icon}"></i>
            <span>${message}</span>
        `;
        notification.className = `notification ${type}`;
        

        requestAnimationFrame(() => {
            notification.classList.add('show');
            
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    notification.className = 'notification';
                }, 500);
            }, 2000);
        });
    }

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 10) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Add ripple effect to buttons
    const rippleButtons = document.querySelectorAll('.ripple-effect');
    rippleButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const ripple = document.createElement('div');
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            button.appendChild(ripple);

            setTimeout(() => ripple.remove(), 1000);
        });
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });


    copyBtn.addEventListener('click', async () => {
        try {
            copyBtn.classList.add('loading');
            await navigator.clipboard.writeText(outputText.value);
            copyBtn.classList.remove('loading');
            showNotification('تم نسخ النص بنجاح');
            
            const icon = copyBtn.querySelector('i');
            const originalIcon = icon.className;
            
            copyBtn.classList.add('success');
            icon.className = 'fas fa-check';
            copyBtn.innerHTML = '<i class="fas fa-check"></i> تم النسخ!';
            
            setTimeout(() => {
                copyBtn.classList.remove('success');
                icon.className = originalIcon;
                copyBtn.innerHTML = `<i class="${originalIcon}"></i> نسخ النص`;
            }, 2000);
        } catch (err) {
            copyBtn.classList.remove('loading');
            showNotification('فشل نسخ النص', 'error');
            console.error('Failed to copy text:', err);
        }
    });


    clearBtn.addEventListener('click', () => {
        clearBtn.classList.add('loading');
        inputText.classList.add('clearing');
        outputText.classList.add('clearing');
        
        setTimeout(() => {
            inputText.value = '';
            outputText.value = '';
            updateTextStats('');
            inputText.focus();
            
            clearBtn.disabled = true;
            clearBtn.style.opacity = '0.6';
            copyBtn.disabled = true;
            
            clearBtn.classList.remove('loading');
            showNotification('تم حذف النص');
            
            setTimeout(() => {
                inputText.classList.remove('clearing');
                outputText.classList.remove('clearing');
            }, 300);
        }, 150);
    });


    const shareButtons = {
        whatsapp: document.getElementById('shareWhatsapp'),
        facebook: document.getElementById('shareFacebook'),
        twitter: document.getElementById('shareTwitter')
    };

    Object.entries(shareButtons).forEach(([platform, button]) => {
        button.addEventListener('click', () => {
            const text = encodeURIComponent(outputText.value);
            let url = '';

            switch(platform) {
                case 'whatsapp':
                    url = `https://wa.me/?text=${text}`;
                    showNotification('جاري فتح واتساب للمشاركة');
                    break;
                case 'facebook':
                    url = `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}&quote=${text}`;
                    showNotification('جاري فتح فيسبوك للمشاركة');
                    break;
                case 'twitter':
                    url = `https://twitter.com/intent/tweet?text=${text}`;
                    showNotification('جاري فتح تويتر للمشاركة');
                    break;
            }

            if (url) {
                window.open(url, '_blank');
            }
        });
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'c') {
            e.preventDefault();
            if (!copyBtn.disabled) copyBtn.click();
        }
        
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'x') {
            e.preventDefault();
            if (!clearBtn.disabled) clearBtn.click();
        }

        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'd') {
            e.preventDefault();
            toggleSwitch.click();
        }
    });

    // Accessibility
    const announceMessage = (message) => {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('class', 'sr-only');
        announcement.textContent = message;
        document.body.appendChild(announcement);
        setTimeout(() => announcement.remove(), 1000);
    };


    clearBtn.disabled = true;
    clearBtn.style.opacity = '0.6';
    copyBtn.disabled = !outputText.value.length;

    // Modal functionality
    const modal = document.getElementById('aboutModal');
    const aboutBtn = document.getElementById('aboutBtn');
    const closeBtn = modal.querySelector('.close-btn');

    function openModal() {
        modal.classList.add('show');
        setTimeout(() => modal.querySelector('.modal-content').style.opacity = '1', 10);
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.querySelector('.modal-content').style.opacity = '0';
        setTimeout(() => {
            modal.classList.remove('show');
            document.body.style.overflow = '';
        }, 300);
    }

    aboutBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });
});