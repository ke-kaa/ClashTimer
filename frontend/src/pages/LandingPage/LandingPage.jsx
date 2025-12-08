import React from "react";
import "./landingPage.css";
import { Link } from "react-router-dom"; // Import the Link component
import axe from "../../assets/cocAssets/landingPage/axe.png";
import builder from "../../assets/cocAssets/landingPage/builder.png";
import clock from "../../assets/cocAssets/landingPage/clock.png";
import loadingScreen from "../../assets/cocAssets/landingPage/loadingScreenBG.png";
import skeletonSpell from "../../assets/cocAssets/landingPage/skeletonSpell.png";
import sword from "../../assets/cocAssets/landingPage/sword.png";

export default function LandingPage() {
    return (
        <div className="landing-page min-h-screen relative flex bg-cover bg-center bg-no-repeat flex-col items-center justify-center p-[20px]">
            <div className="hero-section relative w-full flex justify-center ">
                <div className="hero-card">
                    <div className="hero-content">
                        <h1 className="hero-title pt-[10px]">Progress Pulse</h1>
                        <h2 className="hero-headline">
                            UPGRADE SMARTER. CLASH FASTER.
                        </h2>
                        <p className="hero-subtitle">
                            Track upgrades to optimize your progress.
                        </p>
                        <Link to="/signup" href="">
                            <div style={{ textAlign: "center" }}>
                                <button to="/signup" className="hero-cta">
                                    Get Started
                                </button>
                            </div>
                        </Link>
                    </div>
                    <div className="builder-character">
                        <img src={builder} alt="Builder" />
                    </div>
                </div>
            </div>

            <div className="features-section flex gap-18">
                <div className="feature-card">
                    <div className="feature-icon relative top-[-55px]">
                        <img src={clock} alt="Timer" />
                    </div>
                    <h3 className="feature-title">Upgrade Timer</h3>
                    <p className="feature-desc">
                        Set smart timers and never miss an upgrade.
                    </p>
                </div>

                <div className="feature-card">
                    <div className="feature-icon relative top-[-70px]">
                        <img
                            src={skeletonSpell}
                            alt="Progress"
                            className="skel-1 "
                        />
                        <img
                            src={skeletonSpell}
                            alt="Progress"
                            className="skel-2 "
                        />
                        <img src={skeletonSpell} alt="Progress" />
                    </div>
                    <h3 className="feature-title">Progress Tracker</h3>
                    <p className="feature-desc">
                        Visualize your village growth step by step.
                    </p>
                </div>

                <div className="feature-card">
                    <div className="feature-icon strategy-icons relative top-[-60px] gap-0">
                        <img
                            src={axe}
                            alt="Axe"
                            className="valk-axe absolute "
                        />
                        <img
                            src={sword}
                            alt="Sword"
                            className="sword left-[-55px]"
                        />
                    </div>
                    <h3 className="feature-title">Strategy Planner</h3>
                    <p className="feature-desc">
                        Plan upgrades to optimize attacks and defense.
                    </p>
                </div>
            </div>
        </div>
    );
}
