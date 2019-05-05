import Layout from '../layouts/index';
import getNotionData from "../data/notion";
import {useState, useEffect} from "react";
import Color from "color";
import Head from "next/head";

// TODO: make it reusable and make a route to show notion pages
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
                    <div key={i}>
                    {
                        section.children.map(subsection =>
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
                        )
                    }
                    </div>
                    //   <section
                    //       key={`section-${i}`}
                    //       className={i === 0 ? "intro" : ""}
                    //       id={i === 1 ? "first" : ""}
                    //   >
                    //       <header>
                    //           {i === 0 ? (
                    //               <>
                    //                   <h1>{renderText(section.title)}</h1>
                    //                   {section.children[0] &&
                    //                   section.children[0].type === "text" ? (
                    //                       <p>{renderText(section.children[0].value)}</p>
                    //                   ) : null}
                    //                   <ul className="actions">
                    //                       <li>
                    //                           <a href="#first" className="arrow scrolly">
                    //                               <span className="label">Next</span>
                    //                           </a>
                    //                       </li>
                    //                   </ul>
                    //               </>
                    //           ) : (
                    //               <h2>{renderText(section.title)}</h2>
                    //           )}
                    //       </header>
                    //       <div className="content">
                    //           {section.children.map(subsection =>
                    //                   subsection.type === "image" ? (
                    //                       <span className={`image ${i === 0 ? "fill" : "main"}`}>
                    //   <NotionImage src={subsection.src}/>
                    // </span>
                    //                   ) : subsection.type === "text" ? (
                    //                       i !== 0 && <p>{renderText(subsection.value)}</p>
                    //                   ) : subsection.type === "list" ? (
                    //                       i !== 0 && (
                    //                           <ul>
                    //                               {subsection.children.map(child => (
                    //                                   <li>{renderText(child)}</li>
                    //                               ))}
                    //                           </ul>
                    //                       )
                    //                   ) : null
                    //           )}
                    //       </div>
                    //   </section>
                );
            })}
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
