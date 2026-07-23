"use client";

import { useState } from "react";
import { TEXT_EXPANDER_PREVIEW_WORDS } from "@/app/_lib/constants";

function TextExpander({ children }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const displayText = isExpanded
        ? children
        : children.split(" ").slice(0, TEXT_EXPANDER_PREVIEW_WORDS).join(" ") +
          "...";

    return (
        <span>
            {displayText}
            <button
                className="text-primary-700 border-b border-primary-700 leading-3 pb-1"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                {isExpanded ? "Show less" : "Show more"}
            </button>
        </span>
    );
}

export default TextExpander;
