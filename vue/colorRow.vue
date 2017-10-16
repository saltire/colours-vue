<template>
    <li>
        <div class='control'><a class='handle' title='Move up/down'>░</a></div>
        <div class='color'><button :title='`Set background to ${color.name}`' v-on:click='onClickColor' :style='{ background: color.format() }'></button></div>
        <div class='name'><input type='text' maxlength='50' v-model.trim='name' v-on:change='setName'></div>
        <div class='hex'><input type='text' maxlength='7' v-model.lazy='hex' v-on:change='setHex'></div>
        <div class='numbers'>
            <div class='number'><input type='text' maxlength='3' v-model.lazy.number='r' data-range='255' v-on:change='setFromRGB'></div>
            <div class='number'><input type='text' maxlength='3' v-model.lazy.number='g' data-range='255' v-on:change='setFromRGB'></div>
            <div class='number'><input type='text' maxlength='3' v-model.lazy.number='b' data-range='255' v-on:change='setFromRGB'></div>
        </div>
        <div class='numbers'>
            <div class='number'><input type='text' maxlength='3' v-model.lazy.number='h' data-range='359' v-on:change='setFromHSV'></div>
            <div class='number'><input type='text' maxlength='3' v-model.lazy.number='s' data-range='100' v-on:change='setFromHSV'></div>
            <div class='number'><input type='text' maxlength='3' v-model.lazy.number='v' data-range='100' v-on:change='setFromHSV'></div>
        </div>
        <div class='color'><button :title='`Set background to ${color.name}`' v-on:click='onClickColor' :style='{ background: color.format() }'></button></div>
        <div class='control'><a class='delete' title='Remove' v-on:click='onClickRemove'>✕</a></div>
    </li>
</template>

<script>
import Color from '../js/color';

export default {
    props: ['color'],
    data() {
        return {
            name: this.color.name,
            hex: this.color.hex(),
            r: this.color.r,
            g: this.color.g,
            b: this.color.b,
            h: this.color.h,
            s: this.color.s,
            v: this.color.v,
        };
    },
    methods: {
        onClickColor() {
            this.$emit('updateBackground', this.color);
        },
        onClickRemove() {
            this.$emit('remove', this.color);
        },
        setName() {
            this.$emit('updateColor', this.color, this.color.clone(this.name));
        },
        setHex() {
            this.$emit('updateColor', this.color, this.color.clone().setHex(this.hex));
        },
        setFromRGB() {
            this.$emit('updateColor', this.color,
                this.color.clone().setRGB(this.r, this.g, this.b));
        },
        setFromHSV() {
            this.$emit('updateColor', this.color,
                this.color.clone().setHSV(this.h, this.s, this.v));
        }
    }
};
</script>
