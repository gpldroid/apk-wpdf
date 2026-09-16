const APP = {
            lang: localStorage.getItem('wpdf-lang') || 'ar',
            theme: localStorage.getItem('wpdf-theme') || 'dark',
            files: [],
            currentTool: null,
            pdfjsReady: false
        };

        // Init PDF.js Worker & Utilities (Cross-Browser Fix)
        try {
            if (window.pdfjsLib) {
                pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
                APP.pdfjsReady = true;
            }
        } catch (e) { console.error("PDF.js Init Error", e); }

        // Polyfill for Older Browsers (Safari 13, older Android WebViews) that don't support file.arrayBuffer()
        async function getFileBuffer(file) {
            if (typeof file.arrayBuffer === 'function') {
                return await file.arrayBuffer();
            }
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve(reader.result);
                reader.onerror = () => reject(reader.error);
                reader.readAsArrayBuffer(file);
            });
        }

        // --- Content & i18n Dictionary ---
        const dict = {
            ar: {
                navTools: "الأدوات", navAbout: "من نحن", navPrivacy: "سياسة الخصوصية", navTerms: "شروط الاستخدام", navContact: "اتصل بنا", btnTools: "استخدم الأدوات",
                heroBadge: "معالجة محلية آمنة 100%", heroTitle: "أدوات PDF تعمل فوراً", heroDesc: "دمج، تقسيم، ضغط وتحويل ملفات PDF مباشرة من متصفحك. أمان تام حيث لا يتم رفع ملفاتك إلى أي خادم، مما يضمن خصوصيتك.", heroBtn: "تصفح الأدوات المجانية",
                filterAll: "الكل", filterOrg: "تنظيم", filterOpt: "تحسين", filterToPDF: "إلى PDF", filterFromPDF: "من PDF", filterSec: "الأمان",
                
                // About & Contact Additions
                aboutTitle: "عن World PDF",
                aboutDesc1: "World PDF هي منصة احترافية مجانية بالكامل، صُممت لتوفير أسهل وأسرع أدوات لمعالجة ملفات PDF مباشرة من متصفحك الإلكتروني دون الحاجة لتثبيت أي برامج أو إنشاء حساب.",
                aboutDesc2: "نحن نولي أهمية قصوى لخصوصيتك؛ تعتمد تقنياتنا على معالجة الملفات محلياً داخل جهازك (Client-side)، مما يعني أن مستنداتك لا تغادر متصفحك ولا تُخزن على أي خوادم خارجية إطلاقاً.",
                contactTitle: "تواصل معنا", contactDesc: "هل لديك استفسار، اقتراح، أو واجهت مشكلة تقنية؟ يسعدنا تواصلك معنا وسنقوم بالرد في أقرب وقت.",
                formName: "الاسم الكامل", formEmail: "البريد الإلكتروني", formMsg: "رسالتك...", formBtn: "إرسال الرسالة", formSuccess: "تم إرسال رسالتك بنجاح! شكراً لتواصلك معنا.",
                
                // Footer & Cookies
                footerDesc: "منصتك المجانية والأكثر أماناً لمعالجة ملفات PDF مباشرة عبر متصفحك. لا مساومة على خصوصية بياناتك.",
                footerLinks: "روابط قانونية", footerSupport: "الدعم والمساعدة", copyright: "© 2026 جميع الحقوق محفوظة — World PDF",
                cookieMsg: "نستخدم ملفات تعريف الارتباط (Cookies) لتحسين تجربتك على موقعنا وعرض إعلانات مخصصة وتحليل الزيارات. للمزيد من التفاصيل، يرجى مراجعة <a href='javascript:void(0)' onclick='openPage(\"privacy\")' class='text-primary hover:underline font-bold'>سياسة الخصوصية</a>.",
                cookieAccept: "موافق", cookieDecline: "إغلاق",
                
                // App Text
                dropTitle: "اختر الملفات أو اسحبها وأفلتها هنا", dropSubPDF: "الصيغ المدعومة: PDF فقط", dropSubImg: "الصيغ المدعومة: JPG, PNG, WebP", dropSubExcel: "الصيغ المدعومة: XLSX, XLS",
                processSuccess: "تمت المعالجة بنجاح!", btnDownload: "تحميل الملف الآن", btnActionExecute: "تنفيذ العملية", btnActionMerge: "دمج وتحميل", btnActionConvert: "تحويل وتحميل", btnActionProtect: "تشفير وتحميل",
                errNoFiles: "يرجى اختيار ملف واحد على الأقل", errGeneral: "حدث خطأ أثناء المعالجة", errPassword: "يرجى إدخال كلمة المرور",
                statusProcessing: "جاري المعالجة، يرجى الانتظار...", statusDone: "اكتملت العملية ✓",
                lblRange: "نطاق الصفحات (مثال: 1-3, 5):", lblPassword: "كلمة المرور:", lblOrder: "الترتيب الجديد (مثال: 3,1,2):", lblPos: "موقع الترقيم:",
                posBC: "أسفل الوسط", posBR: "أسفل اليمين", posBL: "أسفل اليسار",
                
                // Legal Pages Content (HTML format)
                pagePrivacyTitle: "سياسة الخصوصية",
                pagePrivacyHtml: `
                    <h3 class="text-lg font-bold text-gray-900 dark:text-white">1. خصوصية الملفات ومعالجتها</h3>
                    <p>في World PDF، نؤمن بأن خصوصية مستنداتك هي الأولوية. جميع عمليات معالجة الملفات (الدمج، التقسيم، التحويل، إلخ) تتم <strong>محلياً داخل متصفحك</strong>. نحن لا نقوم برفع، أو نقل، أو تخزين أي من ملفاتك على خوادمنا.</p>
                    
                    <h3 class="text-lg font-bold text-gray-900 dark:text-white mt-4">2. ملفات تعريف الارتباط (Cookies) وإعلانات جوجل</h3>
                    <p>يستخدم موقعنا إعلانات Google AdSense كمورد دعم مالي لإبقاء الخدمة مجانية. تستخدم Google، بصفتها مورِّدًا خارجيًا، ملفات تعريف الارتباط لعرض الإعلانات على موقعنا.</p>
                    <ul class="list-disc list-inside mt-2 space-y-1">
                        <li>استخدام Google لملف تعريف الارتباط DART يتيح لها عرض الإعلانات للمستخدمين استنادًا إلى زياراتهم لموقعنا والمواقع الأخرى على الإنترنت.</li>
                        <li>يمكن للمستخدمين تعطيل استخدام ملف تعريف الارتباط DART بزيارة <a href="https://policies.google.com/technologies/ads" target="_blank" class="text-primary hover:underline">سياسة الخصوصية الخاصة بإعلانات Google</a>.</li>
                    </ul>
                    
                    <h3 class="text-lg font-bold text-gray-900 dark:text-white mt-4">3. سجلات الدخول (Log Files)</h3>
                    <p>مثل معظم المواقع القياسية، نستخدم سجلات الدخول التي تتضمن عناوين بروتوكول الإنترنت (IP)، نوع المتصفح، مزود خدمة الإنترنت (ISP)، طابع التاريخ/الوقت، وصفحات الإحالة/الخروج. تستخدم هذه المعلومات لتحليل الاتجاهات وإدارة الموقع، وهي غير مرتبطة بأي معلومات تحدد الهوية الشخصية.</p>

                    <h3 class="text-lg font-bold text-gray-900 dark:text-white mt-4">4. التغييرات على سياسة الخصوصية</h3>
                    <p>نحتفظ بالحق في تحديث سياسة الخصوصية هذه في أي وقت. سيتم نشر أي تغييرات على هذه الصفحة.</p>
                `,
                pageTermsTitle: "شروط الاستخدام",
                pageTermsHtml: `
                    <h3 class="text-lg font-bold text-gray-900 dark:text-white">1. قبول الشروط</h3>
                    <p>باستخدامك لموقع وأدوات World PDF، فإنك توافق على الالتزام بشروط الاستخدام هذه. إذا كنت لا توافق على أي جزء من هذه الشروط، يرجى التوقف عن استخدام الموقع.</p>
                    
                    <h3 class="text-lg font-bold text-gray-900 dark:text-white mt-4">2. الاستخدام المسموح به</h3>
                    <p>الموقع مقدم للاستخدام الشخصي والمهني لمعالجة المستندات. يُمنع استخدام الموقع لأي أغراض غير قانونية أو محاولة استغلال الثغرات في الخدمة.</p>
                    
                    <h3 class="text-lg font-bold text-gray-900 dark:text-white mt-4">3. إخلاء المسؤولية (Disclaimer)</h3>
                    <p>يتم تقديم الأدوات "كما هي" دون أي ضمانات صريحة أو ضمنية. نحن غير مسؤولين عن أي تلف أو فقدان للبيانات ناتج عن استخدام الموقع. يُنصح دائماً بالاحتفاظ بنسخة احتياطية من ملفاتك الأصلية قبل معالجتها.</p>

                    <h3 class="text-lg font-bold text-gray-900 dark:text-white mt-4">4. حقوق الملكية الفكرية</h3>
                    <p>جميع حقوق التصميم، العلامات التجارية، والمحتوى المعروض على الموقع (باستثناء الإعلانات والمحتويات التابعة لجهات خارجية) مملوكة لـ World PDF.</p>
                `
            },
            en: {
                navTools: "Tools", navAbout: "About Us", navPrivacy: "Privacy Policy", navTerms: "Terms of Use", navContact: "Contact", btnTools: "Use Tools",
                heroBadge: "100% Secure Local Processing", heroTitle: "Instant PDF Tools", heroDesc: "Merge, split, compress, and convert PDFs directly in your browser. Total privacy—your files are never uploaded to any server.", heroBtn: "Explore Free Tools",
                filterAll: "All", filterOrg: "Organize", filterOpt: "Optimize", filterToPDF: "To PDF", filterFromPDF: "From PDF", filterSec: "Security",
                
                aboutTitle: "About World PDF",
                aboutDesc1: "World PDF is a completely free, professional platform designed to provide the easiest and fastest tools for processing PDF files directly in your web browser without installing any software or creating an account.",
                aboutDesc2: "We prioritize your privacy; our technology relies on Client-side Processing, meaning your sensitive documents never leave your browser and are not stored on any external servers.",
                contactTitle: "Contact Us", contactDesc: "Have a question, suggestion, or encountered a technical issue? We'd love to hear from you. Fill out the form below and we'll reply ASAP.",
                formName: "Full Name", formEmail: "Email Address", formMsg: "Your Message...", formBtn: "Send Message", formSuccess: "Your message has been sent successfully! Thank you for contacting us.",
                
                footerDesc: "Your secure, free platform for processing PDFs directly in your browser. No compromise on your data privacy.",
                footerLinks: "Legal Links", footerSupport: "Support & Help", copyright: "© 2026 All Rights Reserved — World PDF",
                cookieMsg: "We use cookies to improve your experience, serve personalized ads, and analyze traffic. For more details, please review our <a href='javascript:void(0)' onclick='openPage(\"privacy\")' class='text-primary hover:underline font-bold'>Privacy Policy</a>.",
                cookieAccept: "Accept", cookieDecline: "Close",
                
                dropTitle: "Choose files or drag & drop here", dropSubPDF: "Supported formats: PDF only", dropSubImg: "Supported formats: JPG, PNG, WebP", dropSubExcel: "Supported formats: XLSX, XLS",
                processSuccess: "Processing completed successfully!", btnDownload: "Download File Now", btnActionExecute: "Execute", btnActionMerge: "Merge & Download", btnActionConvert: "Convert & Download", btnActionProtect: "Encrypt & Download",
                errNoFiles: "Please select at least one file", errGeneral: "An error occurred during processing", errPassword: "Please enter a password",
                statusProcessing: "Processing, please wait...", statusDone: "Completed ✓",
                lblRange: "Page range (e.g. 1-3, 5):", lblPassword: "Password:", lblOrder: "New order (e.g. 3,1,2):", lblPos: "Number Position:",
                posBC: "Bottom Center", posBR: "Bottom Right", posBL: "Bottom Left",
                
                pagePrivacyTitle: "Privacy Policy",
                pagePrivacyHtml: `
                    <h3 class="text-lg font-bold text-gray-900 dark:text-white">1. File Privacy & Processing</h3>
                    <p>At World PDF, we believe your document privacy is paramount. All file processing operations (merging, splitting, conversion, etc.) happen <strong>locally within your browser</strong>. We do not upload, transfer, or store any of your files on our servers.</p>
                    
                    <h3 class="text-lg font-bold text-gray-900 dark:text-white mt-4">2. Cookies and Google Ads</h3>
                    <p>Our site uses Google AdSense as a financial support resource to keep the service free. Google, as a third-party vendor, uses cookies to serve ads on our site.</p>
                    <ul class="list-disc list-inside mt-2 space-y-1">
                        <li>Google's use of the DART cookie enables it to serve ads to users based on their visit to our site and other sites on the Internet.</li>
                        <li>Users may opt out of the use of the DART cookie by visiting the <a href="https://policies.google.com/technologies/ads" target="_blank" class="text-primary hover:underline">Google ad and content network privacy policy</a>.</li>
                    </ul>
                    
                    <h3 class="text-lg font-bold text-gray-900 dark:text-white mt-4">3. Log Files</h3>
                    <p>Like many standard Web sites, we use log files. This includes IP addresses, browser type, internet service provider (ISP), referring/exit pages, and date/time stamps to analyze trends and administer the site. This information is not linked to anything personally identifiable.</p>

                    <h3 class="text-lg font-bold text-gray-900 dark:text-white mt-4">4. Changes to Privacy Policy</h3>
                    <p>We reserve the right to update this privacy policy at any time. Any changes will be posted on this page.</p>
                `,
                pageTermsTitle: "Terms of Use",
                pageTermsHtml: `
                    <h3 class="text-lg font-bold text-gray-900 dark:text-white">1. Acceptance of Terms</h3>
                    <p>By accessing and using World PDF, you agree to be bound by these Terms of Use. If you do not agree to any part of these terms, please stop using the site.</p>
                    
                    <h3 class="text-lg font-bold text-gray-900 dark:text-white mt-4">2. Permitted Use</h3>
                    <p>The site is provided for personal and professional use for document processing. You are prohibited from using the site for any illegal purposes or attempting to exploit vulnerabilities in the service.</p>
                    
                    <h3 class="text-lg font-bold text-gray-900 dark:text-white mt-4">3. Disclaimer</h3>
                    <p>The tools are provided "as is" without any express or implied warranties. We are not liable for any damage or loss of data resulting from the use of the site. It is always recommended to keep a backup of your original files before processing.</p>

                    <h3 class="text-lg font-bold text-gray-900 dark:text-white mt-4">4. Intellectual Property</h3>
                    <p>All design rights, trademarks, and content displayed on the site (excluding third-party ads and content) are owned by World PDF.</p>
                `
            }
        };

        const toolsData = [
            { id: 'merge', cat: 'organize', icon: 'fa-layer-group', color: 'purple', accept: 'application/pdf,.pdf', multi: true, actionBtn: 'btnActionMerge',
              ar: { t: 'دمج PDF', d: 'دمج عدة ملفات في ملف واحد' }, en: { t: 'Merge PDF', d: 'Combine multiple files into one' } },
            { id: 'split', cat: 'organize', icon: 'fa-scissors', color: 'purple', accept: 'application/pdf,.pdf', multi: false, actionBtn: 'btnActionExecute',
              ar: { t: 'تقسيم PDF', d: 'استخراج صفحات أو نطاقات' }, en: { t: 'Split PDF', d: 'Extract pages or ranges' } },
            { id: 'delete', cat: 'organize', icon: 'fa-trash-can', color: 'purple', accept: 'application/pdf,.pdf', multi: false, actionBtn: 'btnActionExecute',
              ar: { t: 'حذف صفحات', d: 'اختيار الصفحات وإزالتها' }, en: { t: 'Delete Pages', d: 'Select and remove pages' } },
            { id: 'reorder', cat: 'organize', icon: 'fa-sort', color: 'purple', accept: 'application/pdf,.pdf', multi: false, actionBtn: 'btnActionExecute',
              ar: { t: 'إعادة ترتيب الصفحات', d: 'تحديد ترتيب الصفحات' }, en: { t: 'Reorder Pages', d: 'Set a new page order' } },
            { id: 'compress', cat: 'optimize', icon: 'fa-compress', color: 'blue', accept: 'application/pdf,.pdf', multi: false, actionBtn: 'btnActionExecute',
              ar: { t: 'ضغط PDF', d: 'إعادة حفظ PDF لتحسين الحجم' }, en: { t: 'Compress PDF', d: 'Re-save PDF to optimize size' } },
            { id: 'images', cat: 'toPDF', icon: 'fa-image', color: 'green', accept: 'image/jpeg,image/png,image/webp,image/*,.jpg,.jpeg,.png,.webp', multi: true, actionBtn: 'btnActionConvert', type: 'img',
              ar: { t: 'صور إلى PDF', d: 'JPG وPNG وWebP إلى PDF' }, en: { t: 'Images to PDF', d: 'JPG, PNG and WebP to PDF' } },
            { id: 'word', cat: 'fromPDF', icon: 'fa-file-word', color: 'blue', accept: 'application/pdf,.pdf', multi: false, actionBtn: 'btnActionConvert',
              ar: { t: 'PDF إلى Word', d: 'استخراج النص إلى DOCX' }, en: { t: 'PDF to Word', d: 'Extract text to DOCX' } },
            { id: 'excel', cat: 'toPDF', icon: 'fa-file-excel', color: 'green', accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,.xlsx,.xls', multi: true, actionBtn: 'btnActionConvert', type: 'excel',
              ar: { t: 'Excel إلى PDF', d: 'تحويل أوراق Excel إلى PDF' }, en: { t: 'Excel to PDF', d: 'Convert Excel sheets to PDF' } },
            { id: 'ppt', cat: 'fromPDF', icon: 'fa-file-powerpoint', color: 'orange', accept: 'application/pdf,.pdf', multi: false, actionBtn: 'btnActionConvert',
              ar: { t: 'PDF إلى PPT', d: 'كل صفحة في شريحة' }, en: { t: 'PDF to PPT', d: 'Each page becomes a slide' } },
            { id: 'protect', cat: 'security', icon: 'fa-lock', color: 'red', accept: 'application/pdf,.pdf', multi: false, actionBtn: 'btnActionProtect',
              ar: { t: 'حماية PDF', d: 'تشفير PDF بكلمة مرور' }, en: { t: 'Protect PDF', d: 'Encrypt PDF with a password' } },
            { id: 'unlock', cat: 'security', icon: 'fa-unlock', color: 'red', accept: 'application/pdf,.pdf', multi: false, actionBtn: 'btnActionExecute',
              ar: { t: 'فك حماية PDF', d: 'فتح ملف محمي بكلمة مرور' }, en: { t: 'Unlock PDF', d: 'Unlock with known password' } },
            { id: 'numbers', cat: 'organize', icon: 'fa-hashtag', color: 'yellow', accept: 'application/pdf,.pdf', multi: false, actionBtn: 'btnActionExecute',
              ar: { t: 'أرقام الصفحات', d: 'إضافة أرقام للصفحات' }, en: { t: 'Page Numbers', d: 'Add page numbers' } }
        ];

        const $ = s => document.querySelector(s);

        // --- STREAMING_CHUNK:UI Updaters (i18n & Theme) ---
        function renderGrid() {
            const grid = $('#toolsGrid');
            grid.innerHTML = toolsData.map(t => {
                const colors = {
                    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
                    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
                    green: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
                    orange: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
                    red: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
                    yellow: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
                };
                return `
                <div class="tool-card bg-white dark:bg-darkCard border border-gray-200 dark:border-darkBorder rounded-2xl p-5 cursor-pointer hover:border-primary hover:shadow-lg dark:hover:shadow-primary/5 transition-all group flex items-center gap-4" data-cat="${t.cat}" onclick="openTool('${t.id}')">
                    <div class="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center text-xl transition-transform group-hover:scale-110 ${colors[t.color]}">
                        <i class="fa-solid ${t.icon}"></i>
                    </div>
                    <div>
                        <h3 class="font-bold text-gray-900 dark:text-white text-lg">${t[APP.lang].t}</h3>
                        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-1">${t[APP.lang].d}</p>
                    </div>
                </div>`;
            }).join('');
        }

        function applyLanguage() {
            document.documentElement.lang = APP.lang;
            document.documentElement.dir = APP.lang === 'ar' ? 'rtl' : 'ltr';
            $('#langBtn').textContent = APP.lang === 'ar' ? 'EN' : 'AR';
            
            // Text Replacements
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                if (dict[APP.lang][key]) {
                    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                         el.placeholder = dict[APP.lang][key];
                    } else {
                         el.innerHTML = dict[APP.lang][key]; // innerHTML used to keep icons/spans if present
                    }
                }
            });
            
            // Special cases (innerHTML with links)
            $('#cookieText').innerHTML = dict[APP.lang].cookieMsg;

            renderGrid();
            if(APP.currentTool) {
                const tool = toolsData.find(t => t.id === APP.currentTool);
                $('#modalTitle').innerHTML = `<i class="fa-solid ${tool.icon} text-${tool.color}-500"></i> ${tool[APP.lang].t}`;
                $('#actionBtnText').textContent = dict[APP.lang][tool.actionBtn] || dict[APP.lang].btnActionExecute;
                updateExtraControlsLang();
            }
        }

        function applyTheme() {
            if (APP.theme === 'dark') {
                document.documentElement.classList.add('dark');
                $('#themeBtn').innerHTML = '<i class="fa-solid fa-sun"></i>';
            } else {
                document.documentElement.classList.remove('dark');
                $('#themeBtn').innerHTML = '<i class="fa-solid fa-moon"></i>';
            }
        }

        // --- STREAMING_CHUNK:Event Listeners & Utils ---
        $('#langBtn').onclick = () => { APP.lang = APP.lang === 'ar' ? 'en' : 'ar'; localStorage.setItem('wpdf-lang', APP.lang); applyLanguage(); };
        $('#themeBtn').onclick = () => { APP.theme = APP.theme === 'dark' ? 'light' : 'dark'; localStorage.setItem('wpdf-theme', APP.theme); applyTheme(); };

        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.onclick = () => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const cat = btn.getAttribute('data-cat');
                document.querySelectorAll('.tool-card').forEach(card => {
                    card.style.display = (cat === 'all' || card.getAttribute('data-cat') === cat) ? 'flex' : 'none';
                });
            };
        });

        window.onscroll = () => {
            const btn = $('#backTop');
            if (window.scrollY > 300) btn.classList.remove('opacity-0', 'pointer-events-none');
            else btn.classList.add('opacity-0', 'pointer-events-none');
        };
        $('#backTop').onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });

        function showToast(msg, isError = false) {
            const t = $('#toast');
            $('#toastMsg').textContent = msg;
            $('#toastIcon').className = `fa-solid ${isError ? 'fa-circle-exclamation text-red-400' : 'fa-circle-check text-green-400'}`;
            t.classList.remove('translate-y-20', 'opacity-0', 'pointer-events-none');
            setTimeout(() => t.classList.add('translate-y-20', 'opacity-0', 'pointer-events-none'), 3500);
        }

        // --- STREAMING_CHUNK:Cookies & Content Modals (AdSense Setup) ---
        function checkCookies() {
            if (!localStorage.getItem('cookieConsent')) {
                setTimeout(() => {
                    $('#cookieBanner').classList.remove('translate-y-full');
                }, 1000);
            }
        }
        function acceptCookies() {
            localStorage.setItem('cookieConsent', 'true');
            $('#cookieBanner').classList.add('translate-y-full');
        }

        function openPage(page) {
            const m = $('#pageModal');
            let titleStr = page === 'privacy' ? 'pagePrivacyTitle' : 'pageTermsTitle';
            let contentStr = page === 'privacy' ? 'pagePrivacyHtml' : 'pageTermsHtml';
            
            $('#pageTitle').textContent = dict[APP.lang][titleStr];
            $('#pageContent').innerHTML = dict[APP.lang][contentStr];
            
            m.classList.remove('modal-hidden');
        }
        function closePage() {
            $('#pageModal').classList.add('modal-hidden');
        }
        $('#pageModal').addEventListener('mousedown', e => { if (e.target === $('#pageModal')) closePage(); });

        $('#contactForm').onsubmit = (e) => {
            e.preventDefault();
            // Simulate form submission to keep it frontend only
            const btn = e.target.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            btn.innerHTML = `<div class="spinner border-t-white"></div>`;
            btn.disabled = true;
            
            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.disabled = false;
                e.target.reset();
                showToast(dict[APP.lang].formSuccess);
            }, 1500);
        };


        // --- STREAMING_CHUNK:File Operations & Tool Modals ---
        const modal = $('#modal');
        const fileInput = $('#fileInput');
        const dropzone = $('#dropzone');

        function openTool(toolId) {
            APP.currentTool = toolId;
            APP.files = [];
            const tool = toolsData.find(t => t.id === toolId);
            
            $('#modalTitle').innerHTML = `<i class="fa-solid ${tool.icon} text-${tool.color}-500"></i> ${tool[APP.lang].t}`;
            $('#actionBtnText').textContent = dict[APP.lang][tool.actionBtn] || dict[APP.lang].btnActionExecute;
            
            const subType = tool.type === 'img' ? 'dropSubImg' : tool.type === 'excel' ? 'dropSubExcel' : 'dropSubPDF';
            $('#dropSubtitle').setAttribute('data-i18n', subType);
            $('#dropSubtitle').textContent = dict[APP.lang][subType];
            
            fileInput.accept = tool.accept;
            tool.multi ? fileInput.setAttribute('multiple', '') : fileInput.removeAttribute('multiple');
            
            renderFiles();
            $('#resultBox').classList.add('hidden');
            $('#statusText').textContent = '';
            $('#actionBtn').disabled = false;
            $('#actionBtn').innerHTML = `<span id="actionBtnText">${dict[APP.lang][tool.actionBtn] || dict[APP.lang].btnActionExecute}</span>`;
            
            buildExtraControls(toolId);
            modal.classList.remove('modal-hidden');
        }

        function closeTool() { modal.classList.add('modal-hidden'); APP.currentTool = null; APP.files = []; fileInput.value = ''; }
        modal.addEventListener('mousedown', e => { if (e.target === modal) closeTool(); });

        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(evt => dropzone.addEventListener(evt, e => { e.preventDefault(); e.stopPropagation(); }));
        ['dragenter', 'dragover'].forEach(evt => dropzone.addEventListener(evt, () => dropzone.classList.add('border-primary', 'bg-red-50', 'dark:bg-red-900/10')));
        ['dragleave', 'drop'].forEach(evt => dropzone.addEventListener(evt, () => dropzone.classList.remove('border-primary', 'bg-red-50', 'dark:bg-red-900/10')));
        dropzone.addEventListener('drop', e => handleFiles(e.dataTransfer.files));
        dropzone.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', e => { handleFiles(e.target.files); e.target.value = ''; });

        function handleFiles(files) {
            if (!files.length) return;
            const tool = toolsData.find(t => t.id === APP.currentTool);
            let newFiles = Array.from(files);
            if(!tool.multi) newFiles = [newFiles[0]];
            tool.multi ? APP.files = [...APP.files, ...newFiles] : APP.files = newFiles;
            renderFiles();
            $('#resultBox').classList.add('hidden');
        }

        function removeFile(index) { APP.files.splice(index, 1); renderFiles(); }

        function renderFiles() {
            const list = $('#fileList');
            if(!APP.files.length) { list.innerHTML = ''; return; }
            list.innerHTML = APP.files.map((f, i) => `
                <div class="flex items-center justify-between bg-gray-100 dark:bg-[#1e293b] p-3 rounded-lg border border-gray-200 dark:border-darkBorder group">
                    <div class="flex items-center gap-3 overflow-hidden">
                        <i class="fa-solid fa-file text-gray-400"></i>
                        <div class="flex flex-col overflow-hidden">
                            <span class="text-sm font-bold truncate" title="${f.name}">${f.name}</span>
                            <span class="text-xs text-gray-500">${(f.size / 1024 / 1024).toFixed(2)} MB</span>
                        </div>
                    </div>
                    <button onclick="event.stopPropagation(); removeFile(${i})" class="text-gray-400 hover:text-red-500 p-2 rounded-md hover:bg-white dark:hover:bg-darkCard transition-colors">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            `).join('');
        }

        function buildExtraControls(toolId) {
            const box = $('#toolControls');
            box.innerHTML = '';
            box.classList.remove('hidden');
            const inputClass = "w-full mt-1 p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-[#0b1120] focus:border-primary focus:ring-1 focus:ring-primary outline-none";
            
            if (['split', 'delete', 'reorder'].includes(toolId)) {
                let lbl = toolId === 'reorder' ? 'lblOrder' : 'lblRange';
                box.innerHTML = `<label class="block text-sm font-bold mb-1" id="lblExt1" data-i18n="${lbl}">${dict[APP.lang][lbl]}</label><input type="text" id="toolInputVal" class="${inputClass}" dir="ltr" placeholder="1-3, 5, 7">`;
            } else if (toolId === 'protect') {
                box.innerHTML = `<label class="block text-sm font-bold mb-1" data-i18n="lblPassword">${dict[APP.lang].lblPassword}</label><input type="password" id="toolInputVal" class="${inputClass}" dir="ltr">`;
            } else if (toolId === 'numbers') {
                box.innerHTML = `<label class="block text-sm font-bold mb-1" data-i18n="lblPos">${dict[APP.lang].lblPos}</label><select id="toolInputVal" class="${inputClass}">
                    <option value="bottom-center" data-i18n="posBC">${dict[APP.lang].posBC}</option>
                    <option value="bottom-right" data-i18n="posBR">${dict[APP.lang].posBR}</option>
                    <option value="bottom-left" data-i18n="posBL">${dict[APP.lang].posBL}</option></select>`;
            } else { box.classList.add('hidden'); }
        }

        function updateExtraControlsLang() {
            const toolId = APP.currentTool;
             if (['split', 'delete', 'reorder'].includes(toolId)) {
                let lbl = toolId === 'reorder' ? 'lblOrder' : 'lblRange';
                const l = $('#lblExt1'); if(l) { l.setAttribute('data-i18n', lbl); l.textContent = dict[APP.lang][lbl]; }
             }
        }

        // --- STREAMING_CHUNK:Processing Engine ---
        let currentResultUrl = null;
        function provideDownload(bytes, filename, type = 'application/pdf') {
            if(currentResultUrl) URL.revokeObjectURL(currentResultUrl);
            const blob = new Blob([bytes], { type });
            currentResultUrl = URL.createObjectURL(blob);
            $('#resultBox').classList.remove('hidden');
            const btn = $('#downloadBtn');
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);
            newBtn.onclick = () => { const a = document.createElement('a'); a.href = currentResultUrl; a.download = filename; a.click(); };
        }

        async function loadPdfDoc(file, password) {
            return await PDFLib.PDFDocument.load(await getFileBuffer(file), password !== undefined ? { password } : undefined);
        }

        function parseRange(s, maxPages) {
            let a = [];
            if(!s) return a;
            for (const x of s.split(',').map(x => x.trim()).filter(Boolean)) {
                if (x.includes('-')) {
                    let [u, v] = x.split('-').map(Number);
                    if(u && v) for (let i = Math.min(u,v); i <= Math.max(u,v); i++) if (i >= 1 && i <= maxPages) a.push(i - 1);
                } else {
                    let i = Number(x);
                    if (!isNaN(i) && i >= 1 && i <= maxPages) a.push(i - 1);
                }
            }
            return [...new Set(a)];
        }

        $('#actionBtn').onclick = async () => {
            if (!APP.files.length) { showToast(dict[APP.lang].errNoFiles, true); return; }
            const btn = $('#actionBtn'); const status = $('#statusText'); const toolId = APP.currentTool;
            btn.disabled = true; const originalBtnHtml = btn.innerHTML;
            btn.innerHTML = `<div class="spinner"></div>`; status.textContent = dict[APP.lang].statusProcessing; $('#resultBox').classList.add('hidden');

            try {
                if (toolId === 'merge') await processMerge();
                else if (toolId === 'images') await processImages();
                else if (toolId === 'split') await processSplit();
                else if (['delete', 'reorder', 'numbers', 'compress'].includes(toolId)) await processEdit(toolId);
                else if (toolId === 'protect') await processProtect();
                else if (toolId === 'unlock') await processUnlock();
                else if (toolId === 'word') await processWord();
                else if (toolId === 'excel') await processExcel();
                else if (toolId === 'ppt') await processPPT();
                status.textContent = dict[APP.lang].statusDone;
            } catch (error) {
                console.error(error); showToast(error.message || dict[APP.lang].errGeneral, true); status.textContent = '';
            } finally {
                btn.disabled = false; btn.innerHTML = originalBtnHtml;
            }
        };

        // Tasks implementations
        async function processMerge() {
            const { merge } = await import('./assets/js/pdf/merge.js');
            const bytes = await merge(APP.files);
            provideDownload(bytes, 'merged.pdf');
        }

        async function processImages() {
    const { imagesToPdf } = await import('./assets/js/pdf/images.js');
    provideDownload(await imagesToPdf(APP.files), 'images_to_pdf.pdf');
}

        async function processSplit() {
    const range = $('#toolInputVal').value;
    const p = await loadPdfDoc(APP.files[0]);
    const nums = parseRange(range, p.getPageCount());
    if (!nums.length) throw new Error('Invalid page range');
    const { extractPages } = await import('./assets/js/pdf/split.js');
    provideDownload(await extractPages(APP.files[0], range), 'split.pdf');
}

        async function processEdit(type) {
    if (type === 'delete') {
        const p = await loadPdfDoc(APP.files[0]);
        const del = parseRange($('#toolInputVal').value, p.getPageCount());
        if (del.length >= p.getPageCount()) throw new Error('Cannot delete all pages');
        const { deletePages } = await import('./assets/js/pdf/edit.js');
        provideDownload(await deletePages(APP.files[0], del), 'delete_result.pdf');
        return;
    }
    if (type === 'reorder') {
        const p = await loadPdfDoc(APP.files[0]);
        const r = parseRange($('#toolInputVal').value, p.getPageCount());
        const order = r.length ? r : [...Array(p.getPageCount()).keys()];
        const { reorderPages } = await import('./assets/js/pdf/edit.js');
        provideDownload(await reorderPages(APP.files[0], order), 'reorder_result.pdf');
        return;
    }
    if (type === 'numbers') {
        const { addPageNumbers } = await import('./assets/js/pdf/numbers.js');
        provideDownload(await addPageNumbers(APP.files[0], $('#toolInputVal').value), 'numbers_result.pdf');
        return;
    }
    const p = await loadPdfDoc(APP.files[0]);
    const out = await PDFLib.PDFDocument.create();
    const pages = await out.copyPages(p, p.getPageIndices());
    pages.forEach(pg => out.addPage(pg));
    provideDownload(await out.save({ useObjectStreams: true }), `${type}_result.pdf`);
}

        async function processProtect() {
            const pwd = $('#toolInputVal').value.trim(); if (!pwd) throw new Error(dict[APP.lang].errPassword);
            const p = await loadPdfDoc(APP.files[0]);
            const pdfBytes = await p.save({ encrypt: { userPassword: pwd, ownerPassword: pwd + 'admin', permissions: { printing: 'highResolution', modifying: false, copying: false } }});
            provideDownload(pdfBytes, 'protected.pdf');
        }

        async function processUnlock() {
            const pwd = prompt(APP.lang === 'ar' ? 'أدخل كلمة المرور الحالية لفك الحماية:' : 'Enter current password to unlock:');
            if (pwd === null) throw new Error('Cancelled');
            const p = await loadPdfDoc(APP.files[0], pwd);
            provideDownload(await p.save(), 'unlocked.pdf');
        }

        async function processWord() {
            if (!APP.pdfjsReady) throw new Error(dict[APP.lang].errPdfjs || "PDF.js Error");
            const pdfData = new Uint8Array(await getFileBuffer(APP.files[0]));
            const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
            let children = [];
            for (let i = 1; i <= pdf.numPages; i++) {
                const pg = await pdf.getPage(i); const content = await pg.getTextContent();
                children.push(new docx.Paragraph({ children: [new docx.TextRun(content.items.map(x => x.str).join(' '))] }));
            }
            const doc = new docx.Document({ sections: [{ properties: {}, children: children }] });
            provideDownload(await (await docx.Packer.toBlob(doc)).arrayBuffer(), 'converted.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
        }

        async function processExcel() {
            const wb = XLSX.read(await getFileBuffer(APP.files[0]), { type: 'array' });
            const { jsPDF } = window.jspdf; const pdf = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
            pdf.setFontSize(10);
            wb.SheetNames.forEach((sn, si) => {
                if (si > 0) pdf.addPage();
                const rows = XLSX.utils.sheet_to_json(wb.Sheets[sn], { header: 1 }); let y = 15;
                pdf.setFontSize(14); pdf.text(String(sn), 10, y); y += 10; pdf.setFontSize(9);
                rows.forEach(r => {
                    pdf.text(r.map(x => String(x != null ? x : '')).join(' | ').substring(0, 120), 10, y); y += 6;
                    if (y > 280) { pdf.addPage(); y = 15; }
                });
            });
            provideDownload(pdf.output('arraybuffer'), 'from_excel.pdf');
        }

        async function processPPT() {
            if (!APP.pdfjsReady) throw new Error(dict[APP.lang].errPdfjs || "PDF.js Error");
            const pdfData = new Uint8Array(await getFileBuffer(APP.files[0]));
            const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;
            const ppt = new PptxGenJS(); ppt.layout = 'LAYOUT_WIDE';
            for (let i = 1; i <= pdf.numPages; i++) {
                const pg = await pdf.getPage(i); const vp = pg.getViewport({ scale: 1.5 });
                const canvas = document.createElement('canvas'); canvas.width = vp.width; canvas.height = vp.height;
                await pg.render({ canvasContext: canvas.getContext('2d'), viewport: vp }).promise;
                ppt.addSlide().addImage({ data: canvas.toDataURL('image/jpeg', 0.85), x: 0, y: 0, w: '100%', h: '100%' });
            }
            provideDownload(await ppt.write({ outputType: 'arraybuffer' }), 'slides.pptx', 'application/vnd.openxmlformats-officedocument.presentationml.presentation');
        }

        // --- STREAMING_CHUNK:App Initialization ---
        applyTheme();
        applyLanguage();
        checkCookies(); // Check and show cookie banner if needed
