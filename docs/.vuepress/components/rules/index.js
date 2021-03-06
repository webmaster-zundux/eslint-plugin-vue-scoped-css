import * as coreRules from "../../../../node_modules/eslint4b/dist/core-rules"
import plugin from "../../../../"
import pluginVue from "eslint-plugin-vue"

const CATEGORY_TITLES = {
    base: "Base Rules",
    recommended: "Recommended",
    "vue2-recommended": "Recommended for Vue.js 2.x",
    "vue3-recommended": "Recommended for Vue.js 3.x",
    uncategorized: "Uncategorized",
    "eslint-plugin-vue": "eslint-plugin-vue rules",
    "eslint-core-rules@Possible Errors": "ESLint core rules(Possible Errors)",
    "eslint-core-rules@Best Practices": "ESLint core rules(Best Practices)",
    "eslint-core-rules@Strict Mode": "ESLint core rules(Strict Mode)",
    "eslint-core-rules@Variables": "ESLint core rules(Variables)",
    "eslint-core-rules@Node.js and CommonJS":
        "ESLint core rules(Node.js and CommonJS)",
    "eslint-core-rules@Stylistic Issues": "ESLint core rules(Stylistic Issues)",
    "eslint-core-rules@ECMAScript 6": "ESLint core rules(ECMAScript 6)",
}
const CATEGORY_INDEX = {
    base: 0,
    recommended: 1,
    "vue2-recommended": 2,
    "vue3-recommended": 3,
    uncategorized: 4,
    "eslint-plugin-vue": 5,
    "eslint-core-rules@Possible Errors": 6,
    "eslint-core-rules@Best Practices": 7,
    "eslint-core-rules@Strict Mode": 8,
    "eslint-core-rules@Variables": 9,
    "eslint-core-rules@Node.js and CommonJS": 10,
    "eslint-core-rules@Stylistic Issues": 11,
    "eslint-core-rules@ECMAScript 6": 12,
}
const CATEGORY_CLASSES = {
    base: "eslint-plugin-vue-scoped-css__category",
    recommended: "eslint-plugin-vue-scoped-css__category",
    "vue2-recommended": "eslint-plugin-vue-scoped-css__category",
    "vue3-recommended": "eslint-plugin-vue-scoped-css__category",
    uncategorized: "eslint-plugin-vue-scoped-css__category",
    "eslint-plugin-vue": "eslint-plugin-vue__category",
}

function getCategory({ deprecated, docs: { categories } }) {
    if (deprecated) {
        return "deprecated"
    }
    const v2 = categories.some((cat) => cat === "recommended")
    const v3 = categories.some((cat) => cat === "vue3-recommended")
    if (v2) {
        return v3 ? "recommended" : "vue2-recommended"
    } else if (v3) {
        return "vue3-recommended"
    }
    return "uncategorized"
}

const allRules = []

for (const k of Object.keys(plugin.rules)) {
    const rule = plugin.rules[k]
    const category = getCategory(rule.meta)
    allRules.push({
        classes: "eslint-plugin-vue-scoped-css__rule",
        category,
        ruleId: rule.meta.docs.ruleId,
        url: rule.meta.docs.url,
        initChecked: CATEGORY_INDEX[category] <= 3,
    })
}
for (const k of Object.keys(pluginVue.rules)) {
    const rule = pluginVue.rules[k]
    allRules.push({
        category: "eslint-plugin-vue",
        fallbackTitle: "eslint-plugin-vue rules",
        ruleId: `vue/${k}`,
        url: rule.meta.docs.url,
        initChecked: false,
    })
}
for (const k of Object.keys(coreRules)) {
    const rule = coreRules[k]
    allRules.push({
        category: `eslint-core-rules@${rule.meta.docs.category}`,
        fallbackTitle: `ESLint core rules(${rule.meta.docs.category})`,
        ruleId: k,
        url: rule.meta.docs.url,
        initChecked: false, // rule.meta.docs.recommended,
    })
}

allRules.sort((a, b) =>
    a.ruleId > b.ruleId ? 1 : a.ruleId < b.ruleId ? -1 : 0
)

export const categories = []

for (const rule of allRules) {
    const title = CATEGORY_TITLES[rule.category] || rule.fallbackTitle
    let category = categories.find((c) => c.title === title)
    if (!category) {
        category = {
            classes: CATEGORY_CLASSES[rule.category],
            category: rule.category,
            categoryOrder: CATEGORY_INDEX[rule.category],
            title,
            rules: [],
        }
        categories.push(category)
    }
    category.rules.push(rule)
}
categories.sort((a, b) =>
    a.categoryOrder > b.categoryOrder
        ? 1
        : a.categoryOrder < b.categoryOrder
        ? -1
        : a.title > b.title
        ? 1
        : a.title < b.title
        ? -1
        : 0
)

export const DEFAULT_RULES_CONFIG = allRules.reduce((c, r) => {
    if (r.ruleId === "vue/no-parsing-error") {
        c[r.ruleId] = "error"
    } else {
        c[r.ruleId] = r.initChecked ? "error" : "off"
    }
    return c
}, {})

export const rules = allRules
