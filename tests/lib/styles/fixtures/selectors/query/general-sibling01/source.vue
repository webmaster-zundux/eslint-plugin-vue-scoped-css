<template>
    <ul class="foo">
        <li id="a" class="bar" />
        <li id="b" class="baz" />
        <li id="c" class="qux" />
        <li id="d" class="bar" />
        <li id="e" class="baz" />
        <li id="f" class="qux" />
    </ul>
</template>
<style scoped>
.foo > li.baz ~ li ~ li.bar {
}
</style>
