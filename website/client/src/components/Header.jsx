import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { lessons } from "../data/lessons";
import { resetClientForm } from "../lib/api";
import { announceReset } from "../lib/resetEvent";

function Header() {
    // Running the demos changes the real data, so putting this in the header
    // means it can be reached from any lesson rather than only one page.
    const [state, setState] = useState("idle"); // idle | working | done | failed

    const putItBack = async () => {
        setState("working");
        const { failed } = await resetClientForm();
        if (failed) {
            setState("failed");
        } else {
            setState("done");
            announceReset();
        }
        setTimeout(() => setState("idle"), 2200);
    };

    const label = {
        idle: "Reset",
        working: "Resetting",
        done: "Back to three",
        failed: "No server",
    }[state];

    return (
        <header className="masthead">
            <div className="inner">
                <Link to="/" className="brand">
                    <img src="/logo.png" alt="" />
                    <span className="wordmark">Backend Lessons</span>
                </Link>
                <nav>
                    {lessons.map((l, i) => (
                        <NavLink
                            key={l.slug}
                            to={`/lesson/${l.slug}`}
                            className={({ isActive }) => (isActive ? "on" : "")}
                        >
                            {`0${i + 1}`}
                        </NavLink>
                    ))}
                    <NavLink
                        to="/together"
                        className={({ isActive }) => (isActive ? "on wide" : "wide")}
                    >
                        All
                    </NavLink>
                    <button
                        className={`resetnav${state === "done" ? " ok" : ""}${
                            state === "failed" ? " bad" : ""
                        }`}
                        onClick={putItBack}
                        disabled={state === "working"}
                        title="Put the check-in list back to the original three"
                    >
                        {label}
                    </button>
                </nav>
            </div>
        </header>
    );
}

export default Header;
