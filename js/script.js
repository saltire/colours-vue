class Color {
    constructor(name, r, g, b) {
        this.name = name;

        this.r = Number(r) || 0;
        this.g = Number(g) || 0;
        this.b = Number(b) || 0;

        this.calcHSV();
    }

    format() {
        return `rgb(${this.r}, ${this.g}, ${this.b})`;
    }

    hex() {
        const num = this.r * 0x10000 + this.g * 0x100 + this.b;
        const str = num.toString(16);
        return '#' + '000000'.slice(str.length) + str;
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
    }
}

Vue.component('color-row', {
    props: ['initColor'],
    data() {
        return {
            color: new Color(this.initColor.name, this.initColor.r, this.initColor.g, this.initColor.b)
        };
    },
    methods: {
        onClickColor() {
            this.$emit('updateBackground', this.color);
        },
        onClickRemove() {
            this.$emit('remove', this.initColor);
        },
        setFromRGB() {
            this.color.calcHSV();
            this.$emit('updateColor', this.initColor, this.color);
        },
        setFromHSV() {
            this.color.calcRGB();
            this.$emit('updateColor', this.initColor, this.color);
        }
    },
    computed: {
        hex: {
            get() {
                return this.color.hex();
            },
            set(str) {
                // Validate hex format.
                if (/^#?([0-9a-f]{3}){1,2}$/i.test(str)) {
                    const hex = '#' + str.replace('#', '');

                    // Calculate RGB and update color.
                    if (hex.length === 4) {
                        this.color.r = parseInt(hex.slice(1, 2) + hex.slice(1, 2), 16);
                        this.color.g = parseInt(hex.slice(2, 3) + hex.slice(2, 3), 16);
                        this.color.b = parseInt(hex.slice(3, 4) + hex.slice(3, 4), 16);
                    }
                    else {
                        this.color.r = parseInt(hex.slice(1, 3), 16);
                        this.color.g = parseInt(hex.slice(3, 5), 16);
                        this.color.b = parseInt(hex.slice(5, 7), 16);
                    }

                    this.$emit('updateColor', this.initColor, this.color);
                }
                else {
                    // Reset color so that hex is recomputed.
                    this.color = new Color(this.initColor.name, this.initColor.r, this.initColor.g, this.initColor.b);
                }
            }
        }
    },
    template: (
        '<li>' +
            '<div class="control left"><a class="handle" title="Move up/down">░</a></div>' +
            '<div class="color"><button :title="`Set background to ${color.name}`" v-on:click="onClickColor" :style="{ background: color.format() }"></button></div>' +
            '<div class="name"><input type="text" maxlength="50" v-model.trim="color.name"></div>' +
            '<div class="hex"><input type="text" maxlength="7" v-model.lazy="hex"></div>' +
            '<div class="numbers">' +
                '<div class="number"><input type="text" maxlength="3" v-model.lazy.number="color.r" data-range="255" v-on:change="setFromRGB"></div>' +
                '<div class="number"><input type="text" maxlength="3" v-model.lazy.number="color.g" data-range="255" v-on:change="setFromRGB"></div>' +
                '<div class="number"><input type="text" maxlength="3" v-model.lazy.number="color.b" data-range="255" v-on:change="setFromRGB"></div>' +
            '</div>' +
            '<div class="numbers">' +
                '<div class="number"><input type="text" maxlength="3" v-model.lazy.number="color.h" data-range="359" v-on:change="setFromHSV"></div>' +
                '<div class="number"><input type="text" maxlength="3" v-model.lazy.number="color.s" data-range="100" v-on:change="setFromHSV"></div>' +
                '<div class="number"><input type="text" maxlength="3" v-model.lazy.number="color.v" data-range="100" v-on:change="setFromHSV"></div>' +
            '</div>' +
            '<div class="color"><button :title="`Set background to ${color.name}`" v-on:click="onClickColor" :style="{ background: color.format() }"></button></div>' +
            '<div class="control right"><a class="delete" title="Remove" v-on:click="onClickRemove">✕</a></div>' +
        '</li>'
    )
});

const app = new Vue({
    el: '#colors',
    data() {
        return {
            background: new Color('white', 255, 255, 255),
            colors: []
        };
    },
    computed: {
        backClass() {
            return this.background.v > 35 ? 'light' : 'dark';
        }
    },
    methods: {
        load(filename) {
            this.$http.get('/colours.json').then(
                resp => {
                    this.colors = resp.body
                        .map(color => new Color(color.name, color.r, color.g, color.b));
                },
                resp => {
                    console.log('error', resp);
                });
        },
        updateBackground(color) {
            this.background = color;
        },
        updateColor(oldColor, newColor) {
            this.colors.splice(this.colors.indexOf(oldColor), 1, newColor);
        },
        remove(color) {
            this.colors.splice(this.colors.indexOf(color), 1);
        }
    },
    template: (
        '<main :class="backClass" :style="{ background: background.format() }">' +
            '<header>' +
                '<div class="name">Name</div>' +
                '<div class="hex">Hex</div>' +
                '<div class="numbers">RGB</div>' +
                '<div class="numbers">HSV</div>' +
            '</header>' +
            '<ul>' +
                '<color-row v-for="color in colors" :key="`${color.name}-${color.hex()}`" :initColor="color" v-on:updateBackground="updateBackground" v-on:updateColor="updateColor" v-on:remove="remove"></color-row>' +
            '</ul>' +
        '</main>'
    )
});

app.load('/colours.json');
