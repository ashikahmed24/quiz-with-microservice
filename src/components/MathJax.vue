<script setup>
import { onMounted, computed, watch } from "vue";

const props = defineProps({
    type: {
        type: String,
        default: "tex",
    },
    content: {
        type: String,
        required: true,
    },
});

const formattedAsciiMath = computed(() => {
    return `<p>\`${props.content}\`</p>`;
});

const formattedTex = computed(() => {
    return `<p>$$${props.content}$$</p>`;
});

const scriptUrls = {
    asciimath: "https://cdn.jsdelivr.net/npm/mathjax@4/startup.js",
    mathml: "https://cdn.jsdelivr.net/npm/mathjax@4/mml-chtml.js",
    tex: "https://cdn.jsdelivr.net/npm/mathjax@4/tex-chtml.js",
};

const loadMathJax = () => {
    const old = document.querySelector("script[data-mathjax]");
    if (old) old.remove();

    window.MathJax = {};

    if (props.type === "asciimath") {
        window.MathJax = {
            loader: { load: ["input/asciimath", "output/chtml", "ui/menu"] },
            output: { font: "mathjax-newcm" },
        };
    }

    const script = document.createElement("script");
    script.defer = true;
    script.dataset.mathjax = "true";
    script.src = scriptUrls[props.type] || scriptUrls.tex;
    document.head.appendChild(script);
};

onMounted(() => {
    loadMathJax();
});

watch(() => props.type, loadMathJax);
</script>

<template>
    <div class="p-6">
        <div v-if="type === 'asciimath'" v-html="formattedAsciiMath"></div>

        <div v-else-if="type === 'mathml'" v-html="content"></div>

        <div v-else v-html="formattedTex"></div>
    </div>
</template>


<style scoped></style>
