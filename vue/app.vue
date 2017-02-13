<template>
    <main :class='backClass' :style='{ background: background.format() }'>
        <header>
            <h1 class='control'></h1>
            <h1 class='control'></h1>
            <h1 class='name'>Name</h1>
            <h1 class='hex'>Hex</h1>
            <h1 class='numbers'>RGB</h1>
            <h1 class='numbers'>HSV</h1>
            <h1 class='control'></h1>
            <h1 class='control'></h1>
        </header>
        <ul v-sortable='{handle: ".handle", onSort}'>
            <color-row v-for='color in colors' :key='`${color.name}-${color.hex()}`' :initColor='color' v-on:updateBackground='updateBackground' v-on:updateColor='updateColor' v-on:remove='remove'></color-row>
        </ul>
    </main>
</template>

<script>
import Color from '../js/color';
import ColorRow from './colorRow.vue';

export default {
    data() {
        return {
            background: new Color('white', 255, 255, 255),
            colors: []
        };
    },
    components: {
        ColorRow
    },
    computed: {
        backClass() {
            return this.background.v > 35 ? 'light' : 'dark';
        }
    },
    created() {
        this.$http.get('./colours.json').then(
            resp => {
                this.colors = resp.body
                    .map(color => new Color(color.name, color.r, color.g, color.b));
            },
            resp => console.log('error', resp));
    },
    methods: {
        updateBackground(color) {
            this.background = color;
        },
        updateColor(oldColor, newColor) {
            this.colors.splice(this.colors.indexOf(oldColor), 1, newColor);
        },
        remove(color) {
            this.colors.splice(this.colors.indexOf(color), 1);
        },
        onSort(e) {
            this.colors.splice(e.newIndex, 0, ...this.colors.splice(e.oldIndex, 1));
        }
    }
};
</script>
