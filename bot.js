const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const HttpProxyAgent = require('http-proxy-agent');
const HttpsProxyAgent = require('https-proxy-agent');

// Đọc token
const tokens = fs.readFileSync('token.txt', 'utf-8')
    .split('\n')
    .map(t => t.trim())
    .filter(t => t);

// Đọc proxy
const proxies = fs.readFileSync('proxy.txt', 'utf-8')
    .split('\n')
    .map(p => p.trim())
    .filter(p => p);

// Đọc nội dung tin nhắn
const messages = fs.readFileSync('text.txt', 'utf-8')
    .split('\n')
    .map(m => m.trim())
    .filter(m => m);

const TARGET_CHANNEL_ID = '1490681736734965875';
const SEND_INTERVAL = 10000;
const DELETE_DELAY = 500;

let proxyIndex = 0;
let messageIndex = 0;

// ==================== 110 FAKE PROFILES ====================

const WINDOWS_USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:120.0) Gecko/20100101 Firefox/120.0',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:119.0) Gecko/20100101 Firefox/119.0',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36 Edg/119.0.0.0',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36 Edg/118.0.0.0',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 OPR/106.0.0.0',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36 OPR/105.0.0.0',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36 OPR/104.0.0.0',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Brave/1.71.120',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36 Brave/1.70.119',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36 Brave/1.69.118',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Vivaldi/6.5.3206.62',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36 Vivaldi/6.4.3160.40',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36 Vivaldi/6.3.3153.5',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 YaBrowser/24.1.0',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36 YaBrowser/24.0.0'
];

const MOBILE_USER_AGENTS = [
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (Linux; Android 14; SM-S901U Build/UP1A.231005.007) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
    'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
    'Mozilla/5.0 (Linux; Android 13; SM-S901B Build/TP1A.220624.014) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
    'Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
    'Mozilla/5.0 (Linux; Android 12; SM-M515F Build/R16NW.M515FXXS8CWH2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
    'Mozilla/5.0 (Linux; Android 12; Xiaomi 12X Build/SKQ1.211006.001) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
    'Mozilla/5.0 (Linux; Android 12; OnePlus 10 Pro) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36',
    'Mozilla/5.0 (iPad; CPU OS 17_2_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (Linux; Android 14; Galaxy Tab S9) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
];

const SCREEN_RESOLUTIONS = [
    '1920x1080', '1366x768', '1440x900', '1600x900', '2560x1440', '3840x2160',
    '1024x768', '1280x720', '2880x1800', '1920x1200', '1680x1050', '1280x800'
];

const TIMEZONES = [
    'UTC', 'GMT', 'EST', 'CST', 'MST', 'PST', 'IST', 'JST', 'AEST', 'CET'
];

const WEBGL_VENDORS = [
    { vendor: 'Google Inc.', renderer: 'ANGLE (Intel HD Graphics 630)' },
    { vendor: 'Google Inc.', renderer: 'ANGLE (NVIDIA GeForce RTX 2080)' },
    { vendor: 'Apple', renderer: 'Apple M1' },
    { vendor: 'Google Inc.', renderer: 'ANGLE (AMD Radeon RX 5700 XT)' },
    { vendor: 'Mozilla', renderer: 'Mozilla Firefox' }
];

// ==================== PROFILE CLASS ====================

class FakeProfile {
    constructor(profileIndex, isWindows) {
        this.profileIndex = profileIndex;
        this.isWindows = isWindows;
        this.profileType = isWindows ? '💻 MÁY TÍNH' : '📱 ĐIỆN THOẠI';
        this.profileTypeShort = isWindows ? 'WINDOWS' : 'MOBILE';
        this.refreshAll();
    }

    refreshAll() {
        this.screenResolution = SCREEN_RESOLUTIONS[Math.floor(Math.random() * SCREEN_RESOLUTIONS.length)];
        this.timezone = TIMEZONES[Math.floor(Math.random() * TIMEZONES.length)];
        this.timezone_offset = this.getRandomOffset();
        
        if (this.isWindows) {
            this.userAgent = WINDOWS_USER_AGENTS[Math.floor(Math.random() * WINDOWS_USER_AGENTS.length)];
            this.platform = 'Win32';
            this.deviceType = 'Máy Tính';
        } else {
            this.userAgent = MOBILE_USER_AGENTS[Math.floor(Math.random() * MOBILE_USER_AGENTS.length)];
            this.platform = this.getRandomMobilePlatform();
            this.deviceType = 'Điện Thoại';
        }
        
        this.canvasFingerprint = this.generateCanvasFingerprint();
        this.webglInfo = WEBGL_VENDORS[Math.floor(Math.random() * WEBGL_VENDORS.length)];
        this.deviceMemory = [2, 4, 8, 16, 32][Math.floor(Math.random() * 5)];
        this.hardwareConcurrency = Math.floor(Math.random() * 16) + 1;
        this.touchSupport = !this.isWindows || Math.random() > 0.7;
        this.sessionId = this.generateSessionId();
        this.language = this.getRandomLanguage();
        this.colorDepth = [24, 32][Math.floor(Math.random() * 2)];
    }

    getRandomOffset() {
        const offsets = [-720, -600, -480, -420, -360, -300, -240, -180, 0, 60, 120, 180, 330, 480, 540, 630, 780, 840];
        return offsets[Math.floor(Math.random() * offsets.length)];
    }

    getRandomMobilePlatform() {
        const platforms = ['iPhone', 'iPad', 'Android'];
        return platforms[Math.floor(Math.random() * platforms.length)];
    }

    getRandomLanguage() {
        const languages = ['vi-VN', 'en-US', 'en-GB', 'zh-CN', 'ja-JP', 'ko-KR', 'fr-FR', 'de-DE', 'es-ES', 'ru-RU'];
        return languages[Math.floor(Math.random() * languages.length)];
    }

    generateCanvasFingerprint() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < 64; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    generateSessionId() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            const r = Math.random() * 16 | 0;
            const v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    getInfo() {
        return {
            profileType: this.profileType,
            profileNum: `Hồ sơ #${this.profileIndex}`,
            deviceType: this.deviceType,
            screen: this.screenResolution,
            timezone: `${this.timezone} (${this.timezone_offset} phút)`,
            platform: this.platform,
            language: this.language,
            canvas: this.canvasFingerprint.substring(0, 24) + '...',
            webglVendor: this.webglInfo.vendor,
            webglRenderer: this.webglInfo.renderer.substring(0, 30),
            memory: `${this.deviceMemory}GB`,
            cores: this.hardwareConcurrency,
            touch: this.touchSupport ? 'Có' : 'Không',
            sessionId: this.sessionId.substring(0, 12) + '...'
        };
    }
}

// ==================== BOT FUNCTIONS ====================

function getNextProxy() {
    if (proxies.length === 0) return null;
    const proxy = proxies[proxyIndex];
    proxyIndex = (proxyIndex + 1) % proxies.length;
    return proxy;
}

function getNextMessage() {
    if (messages.length === 0) return 'Tin nhắn mặc định';
    const msg = messages[messageIndex];
    messageIndex = (messageIndex + 1) % messages.length;
    return msg;
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ==================== KHỞI ĐỘNG BOT ====================

console.log('\n╔════════════════════════════════════════════════════════════╗');
console.log('║  🚀 DISCORD BOT 110 HỒ SƠ TỰ ĐỘNG CHAT HỆ THỐNG');
console.log('║  📊 55 Hồ sơ Máy Tính + 55 Hồ sơ Điện Thoại');
console.log('║  ⏰ Đang khởi động...');
console.log('╚════════════════════════════════════════════════════════════╝\n');

tokens.forEach((token, index) => {
    const proxy = getNextProxy();
    const isWindows = index < 55;
    const profileIndex = index + 1;
    const fakeProfile = new FakeProfile(profileIndex, isWindows);

    const client = new Client({ 
        intents: [
            GatewayIntentBits.Guilds, 
            GatewayIntentBits.GuildMessages, 
            GatewayIntentBits.MessageContent
        ] 
    });

    if (proxy) {
        const httpAgent = new HttpProxyAgent(proxy);
        const httpsAgent = new HttpsProxyAgent(proxy);
        client.options.http = { agent: httpAgent, https: httpsAgent };
    }

    client.on('ready', async () => {
        console.log(`✅ Bot #${profileIndex} (${client.user.tag}) ĐÃ ONLINE! Proxy: ${proxy || 'Trực tiếp'}`);
        
        const channel = await client.channels.fetch(TARGET_CHANNEL_ID);
        if (channel) {
            autoChatTask(channel, client, profileIndex, fakeProfile);
        }
    });

    async function autoChatTask(channel, client, botNum, profile) {
        while (true) {
            try {
                const text = getNextMessage();
                const profileInfo = profile.getInfo();
                
                const embed = new EmbedBuilder()
                    .setColor(profile.isWindows ? 0x0078D4 : 0xFF6B6B)
                    .setTitle(`${profileInfo.profileType} - ${profileInfo.profileNum}`)
                    .setDescription(`💬 **Tin nhắn:** ${text}`)
                    .addFields(
                        { name: '📦 Thiết bị', value: profileInfo.deviceType, inline: true },
                        { name: '📱 Màn hình', value: profileInfo.screen, inline: true },
                        { name: '🕐 Múi giờ', value: profileInfo.timezone, inline: false },
                        { name: '🖥️ Nền tảng', value: profileInfo.platform, inline: true },
                        { name: '🌐 Ngôn ngữ', value: profileInfo.language, inline: true },
                        { name: '💾 Bộ nhớ', value: profileInfo.memory, inline: true },
                        { name: '⚙️ Nhân CPU', value: `${profileInfo.cores}`, inline: true },
                        { name: '👆 Cảm ứng', value: profileInfo.touch, inline: true },
                        { name: '🔷 WebGL Vendor', value: profileInfo.webglVendor, inline: false },
                        { name: '🆔 ID Phiên', value: profileInfo.sessionId, inline: false }
                    )
                    .setFooter({ text: `Hồ sơ ${profile.profileTypeShort} #${botNum}` })
                    .setTimestamp();
                
                const msg = await channel.send({ embeds: [embed] });
                console.log(`📤 Bot #${botNum} (${profileInfo.deviceType}): ${text}`);
                
                await sleep(DELETE_DELAY);
                await msg.delete();
                console.log(`🗑️  Đã xóa #${botNum}`);
                
                profile.refreshAll();
                await sleep(SEND_INTERVAL);
                
            } catch (error) {
                console.error(`❌ Bot #${botNum} Lỗi:`, error.message);
                await sleep(5000);
            }
        }
    }

    client.login(token).catch(err => console.error(`❌ Bot #${profileIndex} Lỗi Đăng nhập:`, err));
});