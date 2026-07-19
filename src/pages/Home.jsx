import { Link } from "react-router-dom";
import { lessons } from "../data/lessons";

function Home() {
    return (
        <>
            <div className="hero">
                <div className="kicker">Backend Assessments, Spring 2026</div>
                <h1>Three backend topics, explained.</h1>
                <p>
                    Each lesson is self contained and covers one topic from start to finish, with the code
                    you can run right on the page.
                </p>
            </div>

            <div className="pick">
                <h2>Choose a lesson</h2>
                <div className="cards">
                    {lessons.map((l, i) => (
                        <Link className="card" to={`/lesson/${l.slug}`} key={l.slug}>
                            <div className="num">{l.num}</div>
                            <h3>{l.title}</h3>
                            <p>{l.blurb}</p>
                            <div className="tags">
                                {l.tags.map((t) => (
                                    <span className="chip" key={t}>
                                        {t}
                                    </span>
                                ))}
                            </div>
                            <div className="go">
                                Open the lesson
                                <span className="arr" aria-hidden="true">
                                    &rarr;
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>

                <Link className="together-card" to="/together">
                    <div>
                        <h3>See all three as one path</h3>
                        <p>
                            Create the table, add data through an endpoint, then show it on a screen. Each
                            step with its code and the result it produces.
                        </p>
                    </div>
                    <span className="arr" aria-hidden="true">
                        &rarr;
                    </span>
                </Link>
            </div>
        </>
    );
}

export default Home;
