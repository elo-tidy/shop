import { computed, nextTick, onMounted, onUnmounted, ref } from "vue";

type Breakpoint = "sm" | "md" | "lg";

const names = ["sm", "md", "lg"] as const;

export function useBreakpoint() {
    const width = ref(0);
    const breakpoints = ref<Record<(typeof names)[number], number>>({
        sm: 0,
        md: 0,
        lg: 0,
    });

    const breakpoint = computed<Breakpoint>(() => {
        if (width.value > breakpoints.value.lg) return "lg";
        if (width.value > breakpoints.value.md) return "md";
        return "sm";
    });

    const update = () => {
        width.value = window.innerWidth;
    };

    onMounted(() => {
        const styles = getComputedStyle(document.documentElement);
        const rootFontSize = parseFloat(styles.fontSize);

        for (const name of names) {
            const value = styles
                .getPropertyValue(`--breakpoint-${name}`)
                .trim();

            if (value.endsWith("rem")) {
                breakpoints.value[name] = parseFloat(value) * rootFontSize;
            } else if (value.endsWith("px")) {
                breakpoints.value[name] = parseFloat(value);
            }
        }
        update();
        window.addEventListener("resize", update);
    });

    onUnmounted(() => {
        window.removeEventListener("resize", update);
    });

    return {
        breakpoint,
        isSm: computed(() => breakpoint.value === "sm"),
        isMd: computed(() => breakpoint.value === "md"),
        isLg: computed(() => breakpoint.value === "lg"),
    };
}
