// src/services/telegramService.js
import { config } from '@/config/environment';

export function useTelegramWebApp() {
    const tg = window.Telegram?.WebApp || {
        ready: () => console.log('Telegram WebApp not available: ready()'),
        expand: () => console.log('Telegram WebApp not available: expand()'),
        openTelegramLink: (url) => {
            console.log('Telegram WebApp not available: openTelegramLink()', url);
            window.open(url, '_blank');
        },
        openLink: (url) => {
            console.log('Telegram WebApp not available: openLink()', url);
            window.open(url, '_blank');
        },
        // Enhanced mock data for development
        initDataUnsafe: {
            user: {
                id: 4252,
                first_name: "Local User",
                username: "local_user",
                language_code: "en",
                is_bot: false,
                is_premium: true,
                added_to_attachment_menu: true
            },
            query_id: "AAH_test_query_id",
            auth_date: Math.floor(Date.now() / 1000),
            hash: "mock_hash"
        },
        initData: "query_id=AAH_test_query_id&user=%7B%22id%22%3A4252%2C%22first_name%22%3A%22Local%20User%22%2C%22username%22%3A%22local_user%22%2C%22language_code%22%3A%22en%22%2C%22is_bot%22%3Afalse%2C%22is_premium%22%3Atrue%2C%22added_to_attachment_menu%22%3Atrue%7D&auth_date=1678886400&hash=mock_hash",
        // Additional WebApp methods
        close: () => console.log('Telegram WebApp not available: close()'),
        sendData: (data) => console.log('Telegram WebApp not available: sendData()', data),
        showAlert: (message) => {
            console.log('Telegram WebApp not available: showAlert()', message);
            alert(message);
        },
        showConfirm: (message) => {
            console.log('Telegram WebApp not available: showConfirm()', message);
            return confirm(message);
        },
        showPopup: (params) => {
            console.log('Telegram WebApp not available: showPopup()', params);
            return Promise.resolve();
        },
        requestContact: () => {
            console.log('Telegram WebApp not available: requestContact()');
            return Promise.resolve();
        },
        requestLocation: () => {
            console.log('Telegram WebApp not available: requestLocation()');
            return Promise.resolve();
        },
        requestWriteAccess: () => {
            console.log('Telegram WebApp not available: requestWriteAccess()');
            return Promise.resolve();
        },
        requestCameraAccess: () => {
            console.log('Telegram WebApp not available: requestCameraAccess()');
            return Promise.resolve();
        },
        requestMicrophoneAccess: () => {
            console.log('Telegram WebApp not available: requestMicrophoneAccess()');
            return Promise.resolve();
        },
        // Theme and UI
        themeParams: {
            bg_color: "#1a1a1a",
            text_color: "#ffffff",
            hint_color: "#999999",
            link_color: "#e53e3e",
            button_color: "#e53e3e",
            button_text_color: "#ffffff"
        },
        colorScheme: "dark",
        isExpanded: true,
        viewportHeight: window.innerHeight,
        viewportStableHeight: window.innerHeight,
        headerColor: "#1a1a1a",
        backgroundColor: "#1a1a1a",
        isClosingConfirmationEnabled: false,
        // Platform info
        platform: "web",
        version: "6.0",
        // Haptic feedback
        HapticFeedback: {
            impactOccurred: (style) => console.log('Haptic feedback:', style),
            notificationOccurred: (type) => console.log('Haptic notification:', type),
            selectionChanged: () => console.log('Haptic selection changed')
        },
        // Cloud storage
        CloudStorage: {
            setItem: (key, value) => {
                console.log('Cloud storage set:', key, value);
                localStorage.setItem(`tg_${key}`, value);
            },
            getItem: (key) => {
                console.log('Cloud storage get:', key);
                return localStorage.getItem(`tg_${key}`);
            },
            getItems: (keys) => {
                console.log('Cloud storage get items:', keys);
                return keys.reduce((acc, key) => {
                    acc[key] = localStorage.getItem(`tg_${key}`);
                    return acc;
                }, {});
            },
            removeItem: (key) => {
                console.log('Cloud storage remove:', key);
                localStorage.removeItem(`tg_${key}`);
            },
            removeItems: (keys) => {
                console.log('Cloud storage remove items:', keys);
                keys.forEach(key => localStorage.removeItem(`tg_${key}`));
            },
            getKeys: () => {
                console.log('Cloud storage get keys');
                return Object.keys(localStorage).filter(key => key.startsWith('tg_'));
            }
        },
        // Biometric manager
        BiometricManager: {
            isInited: true,
            isBiometricAvailable: false,
            isBiometricTokenSaved: false,
            isAccessRequested: false,
            isAccessGranted: false,
            isBiometricTokenUpdateSupported: false,
            deviceId: "mock_device_id",
            init: () => {
                console.log('Biometric manager init');
                return Promise.resolve();
            },
            requestAccess: (params) => {
                console.log('Biometric manager request access:', params);
                return Promise.resolve();
            },
            authenticate: (params) => {
                console.log('Biometric manager authenticate:', params);
                return Promise.resolve();
            },
            updateBiometricToken: (token) => {
                console.log('Biometric manager update token:', token);
                return Promise.resolve();
            },
            openSettings: () => {
                console.log('Biometric manager open settings');
                return Promise.resolve();
            }
        },
        // Back button
        BackButton: {
            isVisible: false,
            show: () => {
                console.log('Back button show');
                tg.BackButton.isVisible = true;
            },
            hide: () => {
                console.log('Back button hide');
                tg.BackButton.isVisible = false;
            },
            onClick: (callback) => {
                console.log('Back button onClick callback set');
            },
            offClick: (callback) => {
                console.log('Back button offClick callback set');
            }
        },
        // Main button
        MainButton: {
            text: "CONTINUE",
            color: "#e53e3e",
            textColor: "#ffffff",
            isVisible: false,
            isActive: true,
            isProgressVisible: false,
            setText: (text) => {
                console.log('Main button set text:', text);
                tg.MainButton.text = text;
            },
            onClick: (callback) => {
                console.log('Main button onClick callback set');
            },
            offClick: (callback) => {
                console.log('Main button offClick callback set');
            },
            show: () => {
                console.log('Main button show');
                tg.MainButton.isVisible = true;
            },
            hide: () => {
                console.log('Main button hide');
                tg.MainButton.isVisible = false;
            },
            enable: () => {
                console.log('Main button enable');
                tg.MainButton.isActive = true;
            },
            disable: () => {
                console.log('Main button disable');
                tg.MainButton.isActive = false;
            },
            showProgress: (leaveActive = false) => {
                console.log('Main button show progress:', leaveActive);
                tg.MainButton.isProgressVisible = true;
            },
            hideProgress: () => {
                console.log('Main button hide progress');
                tg.MainButton.isProgressVisible = false;
            },
            setParams: (params) => {
                console.log('Main button set params:', params);
                Object.assign(tg.MainButton, params);
            }
        },
        // Settings button
        SettingsButton: {
            isVisible: false,
            show: () => {
                console.log('Settings button show');
                tg.SettingsButton.isVisible = true;
            },
            hide: () => {
                console.log('Settings button hide');
                tg.SettingsButton.isVisible = false;
            },
            onClick: (callback) => {
                console.log('Settings button onClick callback set');
            },
            offClick: (callback) => {
                console.log('Settings button offClick callback set');
            }
        }
    };

    const user = tg.initDataUnsafe?.user || {
        id: 4252,
        first_name: "Local User",
        username: "local_user"
    };

    const botToken = config.telegram.botToken;

    // Enhanced Telegram Bot API methods
    const sendTelegramMessage = async (chatId, text, options = {}) => {
        if (!botToken) {
            console.error('Telegram Bot Token is not configured.');
            return;
        }
        try {
            const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: chatId,
                    text: text,
                    parse_mode: options.parseMode || 'HTML',
                    reply_markup: options.replyMarkup,
                    ...options
                }),
            });
            const data = await response.json();
            if (!data.ok) {
                console.error('Failed to send Telegram message:', data.description);
            }
            return data;
        } catch (error) {
            console.error('Error sending Telegram message:', error);
        }
    };

    const sendTelegramPhoto = async (chatId, photo, caption = '', options = {}) => {
        if (!botToken) {
            console.error('Telegram Bot Token is not configured.');
            return;
        }
        try {
            const response = await fetch(`https://api.telegram.org/bot${botToken}/sendPhoto`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: chatId,
                    photo: photo,
                    caption: caption,
                    parse_mode: options.parseMode || 'HTML',
                    reply_markup: options.replyMarkup,
                    ...options
                }),
            });
            const data = await response.json();
            if (!data.ok) {
                console.error('Failed to send Telegram photo:', data.description);
            }
            return data;
        } catch (error) {
            console.error('Error sending Telegram photo:', error);
        }
    };

    const sendTelegramDocument = async (chatId, document, caption = '', options = {}) => {
        if (!botToken) {
            console.error('Telegram Bot Token is not configured.');
            return;
        }
        try {
            const response = await fetch(`https://api.telegram.org/bot${botToken}/sendDocument`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: chatId,
                    document: document,
                    caption: caption,
                    parse_mode: options.parseMode || 'HTML',
                    reply_markup: options.replyMarkup,
                    ...options
                }),
            });
            const data = await response.json();
            if (!data.ok) {
                console.error('Failed to send Telegram document:', data.description);
            }
            return data;
        } catch (error) {
            console.error('Error sending Telegram document:', error);
        }
    };

    const editTelegramMessage = async (chatId, messageId, text, options = {}) => {
        if (!botToken) {
            console.error('Telegram Bot Token is not configured.');
            return;
        }
        try {
            const response = await fetch(`https://api.telegram.org/bot${botToken}/editMessageText`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: chatId,
                    message_id: messageId,
                    text: text,
                    parse_mode: options.parseMode || 'HTML',
                    reply_markup: options.replyMarkup,
                    ...options
                }),
            });
            const data = await response.json();
            if (!data.ok) {
                console.error('Failed to edit Telegram message:', data.description);
            }
            return data;
        } catch (error) {
            console.error('Error editing Telegram message:', error);
        }
    };

    const deleteTelegramMessage = async (chatId, messageId) => {
        if (!botToken) {
            console.error('Telegram Bot Token is not configured.');
            return;
        }
        try {
            const response = await fetch(`https://api.telegram.org/bot${botToken}/deleteMessage`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    chat_id: chatId,
                    message_id: messageId
                }),
            });
            const data = await response.json();
            if (!data.ok) {
                console.error('Failed to delete Telegram message:', data.description);
            }
            return data;
        } catch (error) {
            console.error('Error deleting Telegram message:', error);
        }
    };

    const setTelegramWebhook = async (url, options = {}) => {
        if (!botToken) {
            console.error('Telegram Bot Token is not configured.');
            return;
        }
        try {
            const response = await fetch(`https://api.telegram.org/bot${botToken}/setWebhook`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    url: url,
                    allowed_updates: options.allowedUpdates || ['message', 'callback_query'],
                    ...options
                }),
            });
            const data = await response.json();
            if (!data.ok) {
                console.error('Failed to set Telegram webhook:', data.description);
            }
            return data;
        } catch (error) {
            console.error('Error setting Telegram webhook:', error);
        }
    };

    const getTelegramWebhookInfo = async () => {
        if (!botToken) {
            console.error('Telegram Bot Token is not configured.');
            return;
        }
        try {
            const response = await fetch(`https://api.telegram.org/bot${botToken}/getWebhookInfo`);
            const data = await response.json();
            if (!data.ok) {
                console.error('Failed to get Telegram webhook info:', data.description);
            }
            return data;
        } catch (error) {
            console.error('Error getting Telegram webhook info:', error);
        }
    };

    const getTelegramBotInfo = async () => {
        if (!botToken) {
            console.error('Telegram Bot Token is not configured.');
            return;
        }
        try {
            const response = await fetch(`https://api.telegram.org/bot${botToken}/getMe`);
            const data = await response.json();
            if (!data.ok) {
                console.error('Failed to get Telegram bot info:', data.description);
            }
            return data;
        } catch (error) {
            console.error('Error getting Telegram bot info:', error);
        }
    };

    // Enhanced keyboard builders
    const createInlineKeyboard = (buttons) => {
        return {
            inline_keyboard: buttons
        };
    };

    const createReplyKeyboard = (buttons, options = {}) => {
        return {
            keyboard: buttons,
            resize_keyboard: options.resizeKeyboard || true,
            one_time_keyboard: options.oneTimeKeyboard || false,
            selective: options.selective || false,
            ...options
        };
    };

    const createInlineKeyboardButton = (text, options = {}) => {
        return {
            text: text,
            ...options
        };
    };

    // Bot analytics and monitoring
    const getBotAnalytics = async () => {
        // Mock analytics data for development
        return {
            activeUsers: 1247,
            messagesToday: 89,
            responseTime: 1.2,
            successRate: 94.2,
            uptime: 99.8,
            countries: 89,
            categories: 12
        };
    };

    const getBotPerformance = async () => {
        // Mock performance data
        return {
            cpu: Math.random() * 100,
            memory: Math.random() * 100,
            disk: Math.random() * 100,
            network: Math.random() * 100
        };
    };

    return {
        tg,
        user,
        sendTelegramMessage,
        sendTelegramPhoto,
        sendTelegramDocument,
        editTelegramMessage,
        deleteTelegramMessage,
        setTelegramWebhook,
        getTelegramWebhookInfo,
        getTelegramBotInfo,
        createInlineKeyboard,
        createReplyKeyboard,
        createInlineKeyboardButton,
        getBotAnalytics,
        getBotPerformance
    };
}