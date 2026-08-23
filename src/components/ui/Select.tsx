import { useEffect, useRef, useState, type KeyboardEvent } from "react";

type SelectOption<T extends string> = {
    value: T;
    label: string;
};

type SelectProps<T extends string> = {
    id: string;
    label: string;
    value: T;
    options: readonly SelectOption<T>[];
    onChange: (value: T) => void;
};

function Select<T extends string>({
    id,
    label,
    value,
    options,
    onChange,
}: SelectProps<T>) {
    const [isOpen, setIsOpen] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
    const selectedIndex = Math.max(
        0,
        options.findIndex((option) => option.value === value)
    );
    const selectedOption = options[selectedIndex];
    const listboxId = `${id}-listbox`;

    useEffect(() => {
        if (isOpen) {
            optionRefs.current[focusedIndex]?.focus();
        }
    }, [focusedIndex, isOpen]);

    useEffect(() => {
        if (!isOpen) {
            return;
        }

        const handlePointerDown = (event: PointerEvent) => {
            if (!containerRef.current?.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("pointerdown", handlePointerDown);

        return () => {
            document.removeEventListener("pointerdown", handlePointerDown);
        };
    }, [isOpen]);

    const openSelect = (index = selectedIndex) => {
        setFocusedIndex(index);
        setIsOpen(true);
    };

    const closeSelect = () => {
        setIsOpen(false);
        triggerRef.current?.focus();
    };

    const handleTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
        if (event.key === "ArrowDown") {
            event.preventDefault();
            openSelect(selectedIndex);
        } else if (event.key === "ArrowUp") {
            event.preventDefault();
            openSelect(selectedIndex);
        } else if (event.key === "Escape" && isOpen) {
            event.preventDefault();
            closeSelect();
        }
    };

    const handleOptionKeyDown = (
        event: KeyboardEvent<HTMLButtonElement>,
        index: number
    ) => {
        let nextIndex: number;

        if (event.key === "ArrowDown") {
            nextIndex = (index + 1) % options.length;
        } else if (event.key === "ArrowUp") {
            nextIndex = (index - 1 + options.length) % options.length;
        } else if (event.key === "Home") {
            nextIndex = 0;
        } else if (event.key === "End") {
            nextIndex = options.length - 1;
        } else if (event.key === "Escape") {
            event.preventDefault();
            closeSelect();
            return;
        } else {
            return;
        }

        event.preventDefault();
        setFocusedIndex(nextIndex);
    };

    const handleSelect = (option: SelectOption<T>) => {
        onChange(option.value);
        closeSelect();
    };

    return (
        <div
            ref={containerRef}
            className="relative mt-2"
            onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) {
                    setIsOpen(false);
                }
            }}
        >
            <button
                ref={triggerRef}
                id={id}
                type="button"
                aria-label={`${label}: ${selectedOption.label}`}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-controls={listboxId}
                onClick={() =>
                    isOpen ? closeSelect() : openSelect(selectedIndex)
                }
                onKeyDown={handleTriggerKeyDown}
                className="flex min-w-0 w-full cursor-pointer items-center justify-between rounded-xl border border-slate-300 bg-white py-2.5 pr-3 pl-3 text-left text-sm text-slate-900 shadow-sm outline-hidden focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:border-indigo-400 dark:focus:ring-indigo-950"
            >
                <span className="min-w-0 truncate">{selectedOption.label}</span>
                <svg
                    aria-hidden="true"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className={`ml-3 size-5 shrink-0 text-slate-400 transition-transform duration-150 motion-reduce:transition-none dark:text-slate-500 ${
                        isOpen ? "rotate-180" : ""
                    }`}
                >
                    <path
                        fillRule="evenodd"
                        d="M5.22 7.22a.75.75 0 0 1 1.06 0L10 10.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 8.28a.75.75 0 0 1 0-1.06Z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>

            {isOpen && (
                <div
                    id={listboxId}
                    role="listbox"
                    aria-label={label}
                    className="absolute z-20 mt-2 max-h-60 w-full overflow-x-hidden overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg dark:border-slate-700 dark:bg-slate-900"
                >
                    {options.map((option, index) => {
                        const isSelected = option.value === value;

                        return (
                            <button
                                key={option.value}
                                ref={(element) => {
                                    optionRefs.current[index] = element;
                                }}
                                type="button"
                                role="option"
                                aria-selected={isSelected}
                                tabIndex={index === focusedIndex ? 0 : -1}
                                onClick={() => handleSelect(option)}
                                onKeyDown={(event) =>
                                    handleOptionKeyDown(event, index)
                                }
                                className={`flex min-h-10 w-full cursor-pointer items-center rounded-lg px-3 py-2 text-left text-sm outline-hidden focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-indigo-600 ${
                                    isSelected
                                        ? "bg-indigo-50 font-semibold text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300"
                                        : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800"
                                }`}
                            >
                                {option.label}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default Select;
