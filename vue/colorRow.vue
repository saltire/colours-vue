<template>
    <li>
        <div class='control'><a class='handle' title='Move up/down'>░</a></div>
        <div class='color'><button :title='`Set background to ${color.name}`' @click='onClickColor' :style='{ background: color.format() }'></button></div>
        <div class='name'><input type='text' maxlength='50' v-model.trim='color.name'></div>
        <div class='hex'><input type='text' maxlength='7' :value='hex' @change='setFromHex'></div>
        <div class='numbers'>
            <div class='number'><input type='text' maxlength='3' :value='color.r' data-range='255' @change='setFromRGB'></div>
            <div class='number'><input type='text' maxlength='3' :value='color.g' data-range='255' @change='setFromRGB'></div>
            <div class='number'><input type='text' maxlength='3' :value='color.b' data-range='255' @change='setFromRGB'></div>
        </div>
        <div class='numbers'>
            <div class='number'><input type='text' maxlength='3' :value='color.h' data-range='359' @change='setFromHSV'></div>
            <div class='number'><input type='text' maxlength='3' :value='color.s' data-range='100' @change='setFromHSV'></div>
            <div class='number'><input type='text' maxlength='3' :value='color.v' data-range='100' @change='setFromHSV'></div>
        </div>
        <div class='color'><button :title='`Set background to ${color.name}`' @click='onClickColor' :style='{ background: color.format() }'></button></div>
        <div class='control'><a class='delete' title='Remove' @click='onClickRemove'>✕</a></div>
    </li>
</template>

<script>
import Color from '../js/color';

export default {
    props: ['color'],
    data() {
        return {
            r: color.r,
            g: color.g,
            b: color.b,
            h: color.h,
            s: color.s,
            v: color.v
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
            // this.$emit('updateColor', this.initColor, new Color(this.initColor.name,
            //     null, null, null, this.color.));
        },
        setFromHSV() {
            this.color.calcRGB();
            console.log('set from hsv', this.color);
            // this.$emit('updateColor', this.initColor,
            //     new Color(this.color.name, null, null, null, ));
        },
        setFromHex(e) {
            try {
                this.color.setHex(e.target.value);
            }
            catch (err) {
                e.target.value = this.hex;
            }
        }
    },
    computed: {
        hex() {
            return this.color.hex();
        }
    }
};
</script>
