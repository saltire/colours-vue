export default class Color {
    constructor(name, r, g, b, h, s, v) {
        this.name = name;

        if (r !== undefined && g !== undefined && b !== undefined) {
            this.setRGB(r, g, b);
        }
        else if (h !== undefined && s !== undefined && v !== undefined) {
            this.setHSV(r, g, b);
        }
        else {
            this.setRGB();
        }
    }

    clone() {
        return new Color(this.name, this.r, this.g, this.b, this.h, this.s, this.v);
    }

    format() {
        return `rgb(${this.r}, ${this.g}, ${this.b})`;
    }

    hex() {
        const num = this.r * 0x10000 + this.g * 0x100 + this.b;
        const str = num.toString(16);
        return '#' + '000000'.slice(str.length) + str;
    }

    setHex(str) {
        if (!/^#?([0-9a-f]{3}){1,2}$/i.test(str)) {
            throw new Error('Invalid hex code.');
        }

        const hex = '#' + str.replace('#', '');

        if (hex.length === 4) {
            return this.setRGB(
                parseInt(hex.slice(1, 2) + hex.slice(1, 2), 16),
                parseInt(hex.slice(2, 3) + hex.slice(2, 3), 16),
                parseInt(hex.slice(3, 4) + hex.slice(3, 4), 16));
        }
        else {
            return this.setRGB(
                parseInt(hex.slice(1, 3), 16),
                parseInt(hex.slice(3, 5), 16),
                parseInt(hex.slice(5, 7), 16));
        }
    }

    set r(r) {
        this.r = Math.max(0, Math.min(255, Number(r) || 0));
        this.calcHSV();
    }

    set g(g) {
        this.g = Math.max(0, Math.min(255, Number(g) || 0));
        this.calcHSV();
    }

    set b(b) {
        this.b = Math.max(0, Math.min(255, Number(b) || 0));
        this.calcHSV();
    }

    setRGB(r, g, b) {
        this.r = Math.max(0, Math.min(255, Number(r) || 0));
        this.g = Math.max(0, Math.min(255, Number(g) || 0));
        this.b = Math.max(0, Math.min(255, Number(b) || 0));
        this.calcHSV();
        return this;
    }

    setHSV(h, s, v) {
        this.h = (Number(h) || 0) % 360;
        this.s = Math.max(0, Math.min(100, Number(s) || 0));
        this.v = Math.max(0, Math.min(100, Number(v) || 0));
        this.calcRGB();
        return this;
    }

    calcRGB() {
        const h = this.h / 60;
        const s = this.s / 100;
        const v = this.v / 100;
        let rgb;

        if (s === 0) {
            rgb = [v, v, v];
        }
        else {
            const i = Math.floor(h);
            const data = [
                v * (1 - s),
                v * (1 - s * (h - i)),
                v * (1 - s * (1 - (h - i)))
            ];

            if (i == 0) {
                rgb = [v, data[2], data[0]];
            }
            else if (i == 1) {
                rgb = [data[1], v, data[0]];
            }
            else if (i == 2) {
                rgb = [data[0], v, data[2]];
            }
            else if (i == 3) {
                rgb = [data[0], data[1], v];
            }
            else if (i == 4) {
                rgb = [data[2], data[0], v];
            }
            else if (i == 5) {
                rgb = [v, data[0], data[1]];
            }
        }

        this.r = Math.floor(rgb[0] * 255);
        this.g = Math.floor(rgb[1] * 255);
        this.b = Math.floor(rgb[2] * 255);

        return this;
    }

    calcHSV() {
        const r = this.r / 255;
        const g = this.g / 255;
        const b = this.b / 255;

        const min = Math.min(r, g, b);
        const max = Math.max(r, g, b);

        if (min === max) {
            this.h = 0;
            this.s = 0;
            this.v = Math.floor(min * 100);
        }
        else {
            const dif = (r == min) ? g - b : ((b == min) ? r - g : b - r);
            const hue = (r == min) ? 3 : ((b == min) ? 1 : 5);
            const chr = max - min;

            this.h = Math.floor((hue - dif / chr) * 60);
            this.s = Math.floor(chr / max * 100);
            this.v = Math.floor(max * 100);
        }

        return this;
    }
}
