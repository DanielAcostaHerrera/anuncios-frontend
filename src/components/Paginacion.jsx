import React, { useState } from "react";

export default function Paginacion({ page, totalPages, onPageChange }) {
    const [inputPage, setInputPage] = useState("");

    const getPages = () => {
        const pages = [];
        pages.push(1);

        let start = Math.max(2, page - 4);
        let end = Math.min(totalPages - 1, page + 4);

        const visibleCount = end - start + 1;
        if (visibleCount < 8) {
            const deficit = 8 - visibleCount;
            if (start > 2) {
                start = Math.max(2, start - deficit);
            } else {
                end = Math.min(totalPages - 1, end + deficit);
            }
        }

        for (let i = start; i <= end; i++) pages.push(i);

        if (totalPages > 1) pages.push(totalPages);

        return pages;
    };

    const pages = getPages();

    const handleGo = () => {
        const trimmed = String(inputPage).trim();
        if (!trimmed) return;

        const num = parseInt(trimmed, 10);
        if (!Number.isNaN(num) && num >= 1 && num <= totalPages) {
            onPageChange(num);
            setInputPage("");
        }
    };

    return (
        <div style={{ textAlign: "center", marginTop: 20, width: "100%" }}>
            {/* Botones de páginas */}
            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "center",
                    gap: "8px",
                }}
            >
                {/* Página anterior */}
                {page > 1 && (
                    <button
                        onClick={() => onPageChange(page - 1)}
                        style={{
                            borderRadius: 6,
                            border: "1px solid var(--color-border)",
                            padding: "8px 16px",
                            backgroundColor: "var(--color-primary)",
                            color: "white",
                            cursor: "pointer",
                        }}
                        aria-label="Página anterior"
                    >
                        «
                    </button>
                )}

                {/* Páginas */}
                {pages.map((p, idx) => {
                    const prev = pages[idx - 1];
                    const showEllipsis = prev && p - prev > 1;

                    return (
                        <React.Fragment key={p}>
                            {showEllipsis && (
                                <span
                                    style={{
                                        color: "var(--color-text)",
                                        margin: "0 4px",
                                        fontWeight: 600,
                                    }}
                                >
                                    …
                                </span>
                            )}

                            <button
                                onClick={() => onPageChange(p)}
                                style={{
                                    borderRadius: 6,
                                    border: "1px solid var(--color-border)",
                                    padding: "8px 16px",
                                    backgroundColor:
                                        p === page
                                            ? "var(--color-primary)"
                                            : "var(--color-bg)",
                                    color:
                                        p === page
                                            ? "white"
                                            : "var(--color-text)",
                                    fontWeight: p === page ? "bold" : "normal",
                                    cursor: "pointer",
                                    transition: "0.2s",
                                }}
                                aria-current={p === page ? "page" : undefined}
                            >
                                {p}
                            </button>
                        </React.Fragment>
                    );
                })}

                {/* Página siguiente */}
                {page < totalPages && (
                    <button
                        onClick={() => onPageChange(page + 1)}
                        style={{
                            borderRadius: 6,
                            border: "1px solid var(--color-border)",
                            padding: "8px 16px",
                            backgroundColor: "var(--color-primary)",
                            color: "white",
                            cursor: "pointer",
                        }}
                        aria-label="Página siguiente"
                    >
                        »
                    </button>
                )}
            </div>

            {/* Texto de página */}
            <div
                style={{
                    marginTop: 12,
                    color: "var(--color-text)",
                    fontWeight: 600,
                }}
            >
                Página {page} de {totalPages}
            </div>

            {/* Input para ir a página */}
            <div style={{ marginTop: 8 }}>
                <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    value={inputPage}
                    onChange={(e) => {
                        const value = e.target.value;
                        if (/^\d*$/.test(value)) {
                            const num = parseInt(value, 10);
                            if (value === "" || (num >= 1 && num <= totalPages)) {
                                setInputPage(value);
                            }
                        }
                    }}
                    placeholder="Ir a página..."
                    style={{
                        padding: "6px",
                        borderRadius: "4px",
                        width: "90px",
                        border: "1px solid var(--color-border)",
                        backgroundColor: "var(--color-bg)",
                        color: "var(--color-text)",
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") handleGo();
                    }}
                    aria-label="Ingresar número de página"
                />

                <button
                    onClick={handleGo}
                    style={{
                        marginLeft: "8px",
                        padding: "6px 12px",
                        backgroundColor: "var(--color-primary)",
                        color: "white",
                        border: "1px solid var(--color-primary-dark)",
                        borderRadius: "4px",
                        cursor: "pointer",
                    }}
                >
                    Ir
                </button>
            </div>
        </div>
    );
}

