import {
    type H3Event,
    type EventHandlerRequest,
    getRequestIP,
    getHeader,
} from "h3";

export interface RequestMetadata {
    ipAddress: string | null;
    userAgent: string | null;
    isMobile: boolean;
    browser: string;
    platform: string;
}

function getDeviceInfo(event: H3Event<EventHandlerRequest>): {
    isMobile: boolean;
    browser: string;
    platform: string;
} {
    const userAgent = getHeader(event, "user-agent") || "";
    const platform = getHeader(event, "sec-ch-ua-platform") || "";
    const mobile = getHeader(event, "sec-ch-ua-mobile") || "";
    const uaString = getHeader(event, "sec-ch-ua") || "";

    const devicePlatform = detectPlatform(platform, userAgent);
    const isMobile = detectMobile(mobile, userAgent);
    const browser = detectBrowser(uaString, userAgent);

    return { isMobile, browser, platform: devicePlatform };
}

function detectPlatform(platform: string, userAgent: string): string {
    if (platform) {
        return platform.replace(/"/g, "");
    }

    if (userAgent) {
        if (userAgent.includes("Windows")) return "Windows";
        if (userAgent.includes("Macintosh") || userAgent.includes("Mac OS"))
            return "macOS";
        if (userAgent.includes("Linux") && !userAgent.includes("Android"))
            return "Linux";
        if (userAgent.includes("Android")) return "Android";
        if (
            userAgent.includes("iPhone") ||
            userAgent.includes("iPad") ||
            userAgent.includes("iPod")
        )
            return "iOS";
    }

    return "Unknown OS";
}

function detectMobile(mobileHeader: string, userAgent: string): boolean {
    if (mobileHeader === "?1") {
        return true;
    }

    if (userAgent) {
        return /Mobile|Android|iPhone|iPad|iPod|Windows Phone|IEMobile/.test(
            userAgent
        );
    }

    return false;
}

function detectBrowser(uaString: string, userAgent: string): string {
    if (uaString) {
        const browsers = {
            Chrome: /Chrome|Chromium/i,
            Edge: /Edge/i,
            Safari: /Safari/i,
            Firefox: /Firefox/i,
            Opera: /Opera|OPR/i,
            Brave: /Brave/i,
            Samsung: /Samsung/i,
            IE: /Trident|MSIE/i,
        };

        for (const [name, regex] of Object.entries(browsers)) {
            if (regex.test(uaString)) {
                return name;
            }
        }
    }

    if (userAgent) {
        if (userAgent.includes("Firefox") && !userAgent.includes("Seamonkey"))
            return "Firefox";
        if (userAgent.includes("SamsungBrowser")) return "Samsung Browser";
        if (userAgent.includes("Opera") || userAgent.includes("OPR"))
            return "Opera";
        if (userAgent.includes("Brave")) return "Brave";
        if (userAgent.includes("Edg")) return "Edge";
        if (userAgent.includes("Chrome") && !userAgent.includes("Chromium"))
            return "Chrome";
        if (userAgent.includes("Chromium")) return "Chromium";
        if (
            userAgent.includes("Safari") &&
            !userAgent.includes("Chrome") &&
            !userAgent.includes("Chromium")
        )
            return "Safari";
        if (userAgent.includes("Trident") || userAgent.includes("MSIE"))
            return "Internet Explorer";
    }

    return "Unknown Browser";
}

export function useEventMetadata(
    event: H3Event<EventHandlerRequest>
): RequestMetadata {
    let ipAddress: string | null = null;

    try {
        ipAddress = getRequestIP(event, { xForwardedFor: true }) || null;
    } catch (error) {
        console.error("Failed to get client address:", error);
    }

    const userAgent = getHeader(event, "user-agent") || null;
    const { isMobile, browser, platform } = getDeviceInfo(event);

    return {
        isMobile,
        browser,
        platform,
        ipAddress,
        userAgent,
    };
}
