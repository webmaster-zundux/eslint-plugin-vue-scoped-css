<template>
    <ul>
        <li id="a" :class="'foo'" />
        <li id="b" :class="'bar'" />
        <li id="c" :class="'baz'" />
        <li id="d" :class="'qux bar'" />
        <li id="e" :class="'quux foo bar'" />
    </ul>
</template>
<style scoped>
.bar {
}
</style>
