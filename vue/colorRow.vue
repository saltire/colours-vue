<template>
    <li>
        <div class='control'><a class='handle' title='Move up/down'>░</a></div>
        <div class='color'><button :title='`Set background to ${color.name}`' v-on:click='onClickColor' :style='{ background: color.format() }'></button></div>
        <div class='name'><input type='text' maxlength='50' v-model.trim='color.name'></div>
        <div class='hex'><input type='text' maxlength='7' v-model.lazy='hex'></div>
        <div class='numbers'>
            <div class='number'><input type='text' maxlength='3' v-model.lazy.number='color.r' data-range='255' v-on:change='setFromRGB'></div>
            <div class='number'><input type='text' maxlength='3' v-model.lazy.number='color.g' data-range='255' v-on:change='setFromRGB'></div>
            <div class='number'><input type='text' maxlength='3' v-model.lazy.number='color.b' data-range='255' v-on:change='setFromRGB'></div>
        </div>
        <div class='numbers'>
            <div class='number'><input type='text' maxlength='3' v-model.lazy.number='color.h' data-range='359' v-on:change='setFromHSV'></div>
            <div class='number'><input type='text' maxlength='3' v-model.lazy.number='color.s' data-range='100' v-on:change='setFromHSV'></div>
            <div class='number'><input type='text' maxlength='3' v-model.lazy.number='color.v' data-range='100' v-on:change='setFromHSV'></div>
        </div>
        <div class='color'><button :title='`Set background to ${color.name}`' v-on:click='onClickColor' :style='{ background: color.format() }'></button></div>
        <div class='control'><a class='delete' title='Remove' v-on:click='onClickRemove'>✕</a></div>
    </li>
</template>

<script>
import Color from '../js/color';

export default {
    props: ['initColor'],
    data() {
        return {
            color: new Color(this.initColor.name,
                this.initColor.r, this.initColor.g, this.initColor.b,
                this.initColor.h, this.initColor.s, this.initColor.v)
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
            console.log('set from rgb', this.color);
            this.$emit('updateColor', this.initColor, this.color);
        },
        setFromHSV() {
            this.color.calcRGB();
            console.log('set from hsv', this.color);
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

                    this.color.calcHSV();

                    console.log('set from hex', this.color);
                    this.$emit('updateColor', this.initColor, this.color);
                }
                else {
                    // Reset color so that hex is recomputed.
                    this.color = new Color(this.initColor.name, this.initColor.r, this.initColor.g, this.initColor.b);
                }
            }
        }
    }
};
</script>
