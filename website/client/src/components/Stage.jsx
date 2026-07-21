import FormPreview from "./FormPreview";
import CodeAccordion from "./CodeAccordion";

// What the right-hand panel shows for the section being read. A section names
// its stage in the lesson data; the panel swaps between them as the reader moves
// down the page, so one surface carries the office form and then the code that
// builds it, rather than two separate things appearing and disappearing.

function Stage({ stage, sample, pinned }) {
    if (!stage) return null;
    if (stage.kind === "form") return <FormPreview />;
    if (stage.kind === "code") return <CodeAccordion stage={stage} sample={sample} pinned={pinned} />;
    return null;
}

export default Stage;
