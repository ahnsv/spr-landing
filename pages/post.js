import Layout from '../layouts/index';
import getNotionData from "../data/notion";
import {useState, useEffect} from "react";
import Color from "color";
import Head from "next/head";

export default function Post({sections, etag, meta}) {
    return (
        <Layout className={`notion-post`}>
            <Head>
                {meta.title && <title>{meta.title[0][0]}</title>}
                {meta.description && (
                    <meta name="description" content={meta.description[0][0]}/>
                )}
            </Head>
            {sections.map((section, i) => {
                return (
                    <section
                        key={`section-${i}`}
                        className={i === 0 ? "intro" : ""}
                        id={i === 1 ? "first" : ""}
                    >
                        <header>
                            {i === 0 ? (
                                <>
                                    <h1>{renderText(section.title)}</h1>
                                    {section.children[0] &&
                                    section.children[0].type === "text" ? (
                                        <p>{renderText(section.children[0].value)}</p>
                                    ) : null}
                                    <ul className="actions">
                                        <li>
                                            <a href="#first" className="arrow scrolly">
                                                <span className="label">Next</span>
                                            </a>
                                        </li>
                                    </ul>
                                </>
                            ) : (
                                <h2>{renderText(section.title)}</h2>
                            )}
                        </header>
                        <div className="content">
                            {section.children.map(subsection =>
                                    subsection.type === "image" ? (
                                        <span className={`image ${i === 0 ? "fill" : "main"}`}>
                    <NotionImage src={subsection.src}/>
                  </span>
                                    ) : subsection.type === "text" ? (
                                        i !== 0 && <p>{renderText(subsection.value)}</p>
                                    ) : subsection.type === "list" ? (
                                        i !== 0 && (
                                            <ul>
                                                {subsection.children.map(child => (
                                                    <li>{renderText(child)}</li>
                                                ))}
                                            </ul>
                                        )
                                    ) : null
                            )}
                        </div>
                    </section>
                );
            })}
            <section>
                <header>
                    <h2>Get Started</h2>
                </header>
                <div className="content">
                    <p>Get started with Now + Next.js</p>
                    <ul className="actions">
                        <li>
                            <a
                                href="https://zeit.co"
                                target="_blank"
                                className="button primary large"
                            >
                                Get Started
                            </a>
                        </li>
                        <li>
                            <a
                                href="https://zeit.co/blog/serverless-pre-rendering"
                                target="_blank"
                                className="button large"
                            >
                                Learn More
                            </a>
                        </li>
                    </ul>
                </div>
            </section>
            <div className="copyright">
                Created by{" "}
                <a href="https://zeit.co" target="_blank">
                    ZEIT
                </a>{" "}
                &mdash; Template Design by:{" "}
                <a href="https://html5up.net/license">HTML5 UP</a>.
            </div>

            }
        </Layout>
    )
}

Post.getInitialProps = async ({res}) => {
    const notionData = await getNotionData();
    const etag = require("crypto")
        .createHash("md5")
        .update(JSON.stringify(notionData))
        .digest("hex");

    if (res) {
        res.setHeader("Cache-Control", "s-maxage=1, stale-while-revalidate");
        res.setHeader("X-version", etag);
    }

    return {...notionData, etag};
};

function renderText(title) {
    return title.map(chunk => {
        let wrapper = <span>{chunk[0]}</span>;

        (chunk[1] || []).forEach(el => {
            wrapper = React.createElement(el[0], {}, wrapper);
        });

        return wrapper;
    });
}
