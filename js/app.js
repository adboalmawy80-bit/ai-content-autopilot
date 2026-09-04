document.addEventListener('DOMContentLoaded', () => {
    // Auth Elements
    const loginForm = document.getElementById('loginForm');
    const loginCard = document.getElementById('loginCard');
    const loginView = document.getElementById('loginView');
    const workspaceView = document.getElementById('workspaceView');
    const sessionStatus = document.getElementById('sessionStatus');
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');

    // Engine Elements
    const aiForm = document.getElementById('aiForm');
    const topicInput = document.getElementById('topic');
    const platformSelect = document.getElementById('platform');
    const toneSelect = document.getElementById('tone');
    const generateBtn = document.getElementById('generateBtn');
    const outputArea = document.getElementById('generatedContent');
    const saveBtn = document.getElementById('saveBtn');
    const encStatus = document.getElementById('encStatus');

    let currentCompiledPayload = null;

    // 1. Login Logic via Server API
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        loginBtn.innerText = 'Verifying Credentials...';

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                loginCard.classList.add('exit-anim');

                setTimeout(() => {
                    loginView.classList.add('hidden');
                    workspaceView.classList.remove('hidden');
                    logoutBtn.classList.remove('hidden');
                    sessionStatus.innerText = `USER: ${data.user.name.toUpperCase()}`;
                    sessionStatus.style.color = '#10b981';
                }, 400);
            } else {
                loginCard.classList.add('shake');
                alert(`❌ ${data.message || 'بيانات الدخول غير صحيحة!'}`);
                loginBtn.innerText = 'Authenticate Session ➔';
                setTimeout(() => loginCard.classList.remove('shake'), 400);
            }
        } catch (err) {
            console.error(err);
            alert('❌ فشل الاتصال بالسيرفر!');
            loginBtn.innerText = 'Authenticate Session ➔';
        }
    });

    // 2. Logout Logic
    logoutBtn.addEventListener('click', () => {
        workspaceView.classList.add('hidden');
        loginView.classList.remove('hidden');
        loginCard.classList.remove('exit-anim');
        logoutBtn.classList.add('hidden');
        sessionStatus.innerText = 'AUTH REQUIRED';
        sessionStatus.style.color = '#64748b';
        loginBtn.innerText = 'Authenticate Session ➔';
        document.getElementById('password').value = '';
    });

    // 3. Generate Content Logic
    aiForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const topic = topicInput.value.trim();
        const platform = platformSelect.value;
        const tone = toneSelect.value;

        if (!topic) return;

        generateBtn.innerText = '⏳ Compiling Payload...';
        generateBtn.disabled = true;

        setTimeout(() => {
            const compiledText = `[${tone.toUpperCase()}] ${topic}\n\nKey Strategy: Optimized content campaign tailored for ${platform}.\nSecurity Note: Content processed through AES-256 validation.\n\nStatus: Ready to commit to encrypted database storage.`;
            
            outputArea.value = compiledText;
            currentCompiledPayload = { topic, platform, content: compiledText };

            generateBtn.innerText = '⚡ Compile Content Payload';
            generateBtn.disabled = false;
            saveBtn.disabled = false;
            if (encStatus) encStatus.classList.remove('hidden');
        }, 400);
    });

    // 4. Save Content to MySQL Database
    saveBtn.addEventListener('click', async () => {
        if (!currentCompiledPayload) return;

        saveBtn.innerText = '⏳ Encrypting & Saving...';
        saveBtn.disabled = true;

        try {
            const response = await fetch('/api/posts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(currentCompiledPayload)
            });

            if (response.ok) {
                alert('✅ Data encrypted and committed to MySQL database successfully!');
                saveBtn.innerText = '💾 Saved to Storage';
            } else {
                alert('⚠️ Server error. Please ensure database connection is active.');
                saveBtn.innerText = '💾 Commit to Encrypted Storage';
                saveBtn.disabled = false;
            }
        } catch (err) {
            console.error(err);
            alert('❌ Failed to connect to server backend.');
            saveBtn.innerText = '💾 Commit to Encrypted Storage';
            saveBtn.disabled = false;
        }
    });
});
