const marked = require("marked");
import parse from "html-react-parser";
import Link from "next/link";
import Head from "next/head";
import fetch from "isomorphic-unfetch";
import SideMenu from "../components/sidemenu";
import Header from "../components/header";
import styles from "../styles/pages/layout.module.scss";
import { fetchAPI, fetchAPIByPageId } from "../lib/api";
import { convertPageDataToSlug, createHelp, groupByCategory } from "../utils/editdata";
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import CopyLink from "../components/copylink";
import BlogLinks from "../components/fromblog";

function Page({ pages, pageData, tool, navigationData, prevPageData, nextPageData }) {
    const router = useRouter();
    const [isOpenNav, setIsOpenNav] = useState(false);
    const nav = useRef(null);

    useEffect(() => {
        if (!isOpenNav) return;
        function handleClickOver(event) {
            if (nav.current && !nav.current.contains(event.target)) {
                setIsOpenNav(false);
            }
        }

        window.addEventListener("click", handleClickOver);
        return () => window.removeEventListener("click", handleClickOver);
    }, [isOpenNav]);

    if (router.isFallback) {
        return <div>Loading...</div>;
    }

    const resetMenu = () => {
        setIsOpenNav(false);
    };

    return (
        <>
            <Head>
                <title>Create Next App</title>
                <link rel='icon' href='/favicon.ico' />
            </Head>
            <Header pages={pages} isOpenNav={isOpenNav} setIsOpenNav={setIsOpenNav} showBurger={true} />
            <main className={styles.wrapper}>
                <div ref={nav} className={`${styles.nav} ${isOpenNav && styles.nav_open}`}>
                    <SideMenu data={navigationData} activeItemUrl={pageData.id} callback={resetMenu} />
                </div>
                <section className={styles.section}>
                    <div className={styles.bread_crumb}>
                        <Link href='/'>
                            <a>HOME</a>
                        </Link>
                        <svg width='10' height='10' viewBox='0 0 10 10' fill='none' xmlns='http://www.w3.org/2000/svg'>
                            <path d='M3.75 7.5L6.25 5L3.75 2.5' stroke='#1B2738' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
                        </svg>
                        <Link href={tool === "publish" ? "/publish" : "/twitter"}>
                            <a>{tool === "publish" ? "PUBLISH TOOL" : "TWITTER TOOL"}</a>
                        </Link>
                        <svg width='10' height='10' viewBox='0 0 10 10' fill='none' xmlns='http://www.w3.org/2000/svg'>
                            <path d='M3.75 7.5L6.25 5L3.75 2.5' stroke='#1B2738' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
                        </svg>
                        <span>{pageData.Title}</span>
                    </div>
                    <article>{parse(marked(pageData.Content))}</article>
                    <div className={styles.related_links}>
                        {prevPageData && (
                            <Link href={prevPageData.url}>
                                <a>
                                    <svg
                                        style={{ transform: "rotateY(180deg)" }}
                                        width={20}
                                        height={20}
                                        id='Layer_1'
                                        xmlns='http://www.w3.org/2000/svg'
                                        viewBox='0 0 330 330'>
                                        <path
                                            id='XMLID_27_'
                                            d='M15,180h263.787l-49.394,49.394c-5.858,5.857-5.858,15.355,0,21.213C232.322,253.535,236.161,255,240,255s7.678-1.465,10.606-4.394l75-75c5.858-5.857,5.858-15.355,0-21.213l-75-75c-5.857-5.857-15.355-5.857-21.213,0c-5.858,5.857-5.858,15.355,0,21.213L278.787,150H15c-8.284,0-15,6.716-15,15S6.716,180,15,180z'
                                        />
                                    </svg>
                                    {prevPageData.title}
                                </a>
                            </Link>
                        )}
                        {nextPageData && (
                            <Link href={nextPageData.url}>
                                <a>
                                    {nextPageData.title}
                                    <svg width={20} height={20} id='Layer_1' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 330 330'>
                                        <path
                                            id='XMLID_27_'
                                            d='M15,180h263.787l-49.394,49.394c-5.858,5.857-5.858,15.355,0,21.213C232.322,253.535,236.161,255,240,255s7.678-1.465,10.606-4.394l75-75c5.858-5.857,5.858-15.355,0-21.213l-75-75c-5.857-5.857-15.355-5.857-21.213,0c-5.858,5.857-5.858,15.355,0,21.213L278.787,150H15c-8.284,0-15,6.716-15,15S6.716,180,15,180z'
                                        />
                                    </svg>
                                </a>
                            </Link>
                        )}
                    </div>
                </section>
                <aside className={styles.aside}>
                    <CopyLink />
                    {pageData.BlogLinks.length !== 0 ? <BlogLinks blogLinks={pageData.BlogLinks} /> : null}
                    {/* <BlogLinks /> */}
                </aside>
            </main>
            <button className={styles.toggle_nav} onClick={() => setIsOpenNav(!isOpenNav)}>
                {!isOpenNav ? (
                    <svg width='24' height='24' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'>
                        <path
                            fillRule='evenodd'
                            clipRule='evenodd'
                            d='M3 2.25C2.58579 2.25 2.25 2.58579 2.25 3V21C2.25 21.4142 2.58579 21.75 3 21.75H9H21C21.4142 21.75 21.75 21.4142 21.75 21V3C21.75 2.58579 21.4142 2.25 21 2.25H9H3ZM9.75 3.75V20.25H20.25V3.75H9.75ZM8.25 3.75H3.75V20.25H8.25V3.75Z'
                            fill='#0079BD'></path>
                    </svg>
                ) : (
                    <svg width='14' height='14' viewBox='0 0 14 14' fill='none' xmlns='http://www.w3.org/2000/svg'>
                        <path
                            d='M9.37047 6.99975L13.5089 2.86166C14.1637 2.20685 14.1637 1.14533 13.5089 0.490858C12.8547 -0.163619 11.7926 -0.163619 11.1384 0.490858L7 4.62962L2.86157 0.490858C2.20743 -0.163619 1.14525 -0.163619 0.491109 0.490858C-0.163703 1.14567 -0.163703 2.20718 0.491109 2.86166L4.6292 6.99975L0.491109 11.1378C-0.163703 11.7927 -0.163703 12.8542 0.491109 13.5086C0.818012 13.8362 1.24751 13.9995 1.67634 13.9995C2.10484 13.9995 2.53467 13.8362 2.86157 13.5086L7 9.37055L11.1384 13.509C11.4657 13.8366 11.8948 13.9998 12.3237 13.9998C12.7525 13.9998 13.182 13.8366 13.5089 13.509C14.1637 12.8542 14.1637 11.7927 13.5089 11.1382L9.37047 6.99975Z'
                            fill='white'
                        />
                    </svg>
                )}
            </button>
        </>
    );
}

export async function getStaticPaths() {
    const data = await fetch(`https://mweb-api.circleboom.com/helps`);
    const pagesData = await data.json();

    const paths = pagesData.map((p) => {
        let arr = [];
        p.Tool !== null ? arr.push(p.Tool) : arr.push("common");
        arr.push(p.Category);
        arr.push(
            p.Title.split(" ")
                .join("-")
                .toLowerCase()
                .replace(/[^-\w\s]/gi, "")
        );
        return {
            params: {
                slug: arr,
            },
        };
    });

    return {
        paths,
        fallback: false,
    };
}

export async function getStaticProps({ params }) {
    const allPages = await fetchAPI();

    let filterPagesData = [];

    allPages.map((elem) => {
        filterPagesData.push({
            ...(({ Content, published_at, created_at, updated_at, Featured, MetaDescription, BlogLinks, Slug, ...rest } = elem) => rest)(),
        });
    });

    const unorderedNavigationData = filterPagesData.reduce((ele, node) => {
        ele[node.Category] = [...(ele[node.Category] || []), node];
        return ele;
    }, {});

    const navigationData = Object.keys(unorderedNavigationData)
        .reverse()
        .reduce((obj, key) => {
            obj[key] = unorderedNavigationData[key].sort((a, b) => b.id - a.id);
            return obj;
        }, {});

    let pageData;
    let publishToolHelps = [];
    let twitterToolHelps = [];
    let commonHelps = [];
    let twitterToolOrder;
    let publishToolOrder;
    let commonOrder;

    let str = "/";
    for (let n = 0; n < params.slug.length; n++) {
        str = str + params.slug[n] + "/";
    }

    str = str.slice(0, -1);

    if (allPages.filter((e) => convertPageDataToSlug(e) === str).length === 0) {
        return {
            notFound: true,
        };
    } else {
        pageData = await fetchAPIByPageId(allPages.filter((e) => convertPageDataToSlug(e) === str)[0].id);
        let pageDataIndex = allPages.indexOf(allPages.filter((e) => convertPageDataToSlug(e) === str)[0]);
        let prevPageData = pageDataIndex !== 0 ? { title: allPages[pageDataIndex - 1].Title, url: convertPageDataToSlug(allPages[pageDataIndex - 1]) } : null;

        let nextPageData =
            pageDataIndex !== allPages.length - 1
                ? { title: allPages[pageDataIndex + 1].Title, url: convertPageDataToSlug(allPages[pageDataIndex + 1]) }
                : null;

        pageData.Slug = convertPageDataToSlug(pageData);
        if (pageData.Content.includes('{% hint style="warning" %}')) {
            pageData.Content = pageData.Content.split('{% hint style="warning" %}')
                .join(`<div className='${styles.hint} ${styles.hint_warning}'>`)
                .split("{% endhint %}")
                .join("</div>");
        }
        if (pageData.Content.includes('{% hint style="info" %}')) {
            pageData.Content = pageData.Content.split('{% hint style="info" %}')
                .join(`<div className='${styles.hint} ${styles.hint_info}'>`)
                .split("{% endhint %}")
                .join("</div>");
        }
        if (pageData.Content.includes('{% hint style="danger" %}')) {
            pageData.Content = pageData.Content.split('{% hint style="danger" %}')
                .join(`<div className='${styles.hint} ${styles.hint_danger}'>`)
                .split("{% endhint %}")
                .join("</div>");
        }

        allPages.map((ele) => {
            ele.Tool === "twitter"
                ? twitterToolHelps.push(createHelp(ele))
                : ele.Tool === "publish"
                    ? publishToolHelps.push(createHelp(ele))
                    : commonHelps.push(createHelp(ele));
        });

        twitterToolOrder = groupByCategory(twitterToolHelps);

        publishToolOrder = groupByCategory(publishToolHelps);

        commonOrder = groupByCategory(commonHelps);

        return {
            props: {
                pageData,
                tool: pageData.Tool,
                pages: allPages,
                prevPageData,
                nextPageData,
                navigationData,
            },
            revalidate: 10,
        };
    }
}

export default Page;
