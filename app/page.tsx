"use client";

import { useMemo, useState } from "react";

type HeightUnit = "cm" | "ft";
type WeightUnit = "kg" | "lb";
const categories = [
  { max: 18.5, label: "Underweight", className: "under" },
  { max: 25, label: "Healthy", className: "healthy" },
  { max: 30, label: "Overweight", className: "over" },
  { max: Infinity, label: "Obesity", className: "high" },
];

export default function Home() {
  const [heightUnit, setHeightUnit] = useState<HeightUnit>("cm");
  const [weightUnit, setWeightUnit] = useState<WeightUnit>("kg");
  const [heightCm, setHeightCm] = useState("175");
  const [feet, setFeet] = useState("5");
  const [inches, setInches] = useState("9");
  const [weight, setWeight] = useState("70");

  const result = useMemo(() => {
    const cm = heightUnit === "cm" ? Number(heightCm) : (Number(feet) * 12 + Number(inches)) * 2.54;
    const kg = weightUnit === "kg" ? Number(weight) : Number(weight) * 0.45359237;
    if (!cm || !kg || cm <= 0 || kg <= 0) return null;
    const meters = cm / 100;
    const bmi = kg / (meters * meters);
    const category = categories.find((item) => bmi < item.max) ?? categories[3];
    const lowKg = 18.5 * meters * meters;
    const highKg = 24.9 * meters * meters;
    const displayRange = weightUnit === "kg"
      ? `${lowKg.toFixed(1)}–${highKg.toFixed(1)} kg`
      : `${(lowKg / 0.45359237).toFixed(0)}–${(highKg / 0.45359237).toFixed(0)} lb`;
    return { bmi, category, displayRange };
  }, [heightUnit, weightUnit, heightCm, feet, inches, weight]);
  const marker = result ? Math.max(2, Math.min(98, ((result.bmi - 14) / 26) * 100)) : 0;

  return (
    <main>
      <nav className="nav">
        <a className="brand" href="#top" aria-label="Body Index home"><span className="brand-mark">BI</span><span>BODY INDEX</span></a>
        <span className="nav-note">A quick health snapshot</span>
      </nav>
      <section className="hero" id="top">
        <div className="intro">
          <p className="eyebrow"><span>01</span> BMI CALCULATOR</p>
          <h1>Dr. Vinocur<br /><em>BMI calculator.</em></h1>
          <p className="lede">A simple starting point for understanding whether your weight is in a healthy range for your height.</p>
          <div className="fact"><span className="fact-number">30</span><p>seconds<br />to your result</p></div>
        </div>
        <div className="calculator" aria-label="BMI calculator">
          <div className="calc-header"><div><p className="step">YOUR MEASUREMENTS</p><h2>Let’s calculate.</h2></div><span className="spark" aria-hidden="true">✦</span></div>
          <div className="field-group">
            <div className="field-title"><label htmlFor="height-main">Height</label><select value={heightUnit} onChange={(e) => setHeightUnit(e.target.value as HeightUnit)} aria-label="Height unit"><option value="cm">CM</option><option value="ft">FT / IN</option></select></div>
            {heightUnit === "cm" ? <div className="number-field"><input id="height-main" inputMode="decimal" type="number" min="1" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} /><span>cm</span></div>
              : <div className="split-fields"><div className="number-field"><input id="height-main" inputMode="numeric" type="number" min="1" value={feet} onChange={(e) => setFeet(e.target.value)} /><span>ft</span></div><div className="number-field"><input aria-label="Height inches" inputMode="decimal" type="number" min="0" max="11.99" value={inches} onChange={(e) => setInches(e.target.value)} /><span>in</span></div></div>}
          </div>
          <div className="field-group">
            <div className="field-title"><label htmlFor="weight">Weight</label><select value={weightUnit} onChange={(e) => setWeightUnit(e.target.value as WeightUnit)} aria-label="Weight unit"><option value="kg">KG</option><option value="lb">LB</option></select></div>
            <div className="number-field"><input id="weight" inputMode="decimal" type="number" min="1" value={weight} onChange={(e) => setWeight(e.target.value)} /><span>{weightUnit}</span></div>
          </div>
          <div className={`result ${result ? result.category.className : ""}`} aria-live="polite">
            {result ? <><div className="result-top"><div><p>YOUR BMI</p><strong>{result.bmi.toFixed(1)}</strong></div><span className="status">{result.category.label}</span></div><div className="scale-wrap"><div className="scale"><i style={{ left: `${marker}%` }} /></div><div className="scale-labels"><span>Under</span><span>Healthy</span><span>Over</span><span>High</span></div></div><p className="range">A healthy weight range for your height is <strong>{result.displayRange}</strong>.</p></>
              : <p className="empty">Enter a valid height and weight to see your BMI.</p>}
          </div>
        </div>
      </section>
      <footer><p>BMI is a screening measure, not a diagnosis. Speak with a healthcare professional for personal guidance.</p><span>BODY INDEX / 2026</span></footer>
    </main>
  );
}
