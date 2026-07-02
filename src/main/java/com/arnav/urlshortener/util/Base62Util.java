package com.arnav.urlshortener.util;

public class Base62Util {

    private static final String BASE62_CHARS = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    private static final int BASE = 62;
    
    // A high offset (100 Billion) to ensure all encoded IDs produce a 7-character Base62 string.
    private static final long OFFSET = 100000000000L;

    /**
     * Encodes a database ID into a 7-character Base62 string.
     */
    public static String encode(long id) {
        long value = id + OFFSET;
        StringBuilder sb = new StringBuilder();
        while (value > 0) {
            sb.append(BASE62_CHARS.charAt((int) (value % BASE)));
            value /= BASE;
        }
        return sb.reverse().toString();
    }

    /**
     * Decodes a Base62 string back into the original database ID.
     */
    public static long decode(String str) {
        long value = 0;
        for (int i = 0; i < str.length(); i++) {
            int charIndex = BASE62_CHARS.indexOf(str.charAt(i));
            if (charIndex == -1) {
                throw new IllegalArgumentException("Invalid Base62 character: " + str.charAt(i));
            }
            value = value * BASE + charIndex;
        }
        return value - OFFSET;
    }
}
