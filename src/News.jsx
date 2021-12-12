import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import axios from "axios";
import NewCard from "./components/NewsCard";

const NewsPage = () => {
	const [currentPage, setCurrentPage] = useState(1);
	const [articles, setArticles] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [totalPages, setTotalPages] = useState(0);
	const [searchText, setSearchText] = useState("");
	const [query, setQuery] = useState("");

	

	useEffect(() => {
		setIsLoading(true);
		const fetchData = async () => {
			try {
				const { data } = await axios.get(
					"https://hn.algolia.com/api/v1/search?",
					{
						params: { page: currentPage, query },
					}
				);
				const { hits, nbPages } = data;
				setArticles(hits);
				setTotalPages(nbPages);
			} catch (error) {
				console.log(error);
			} finally {
				setIsLoading(false);
			}
		};
		fetchData();
	}, [query, currentPage]);

	const handleSubmit = async (event) => {
		event.preventDefault();
		setCurrentPage(0);
		setQuery(searchText);
	};

	const handlePageClick = (event) => {
		setCurrentPage(event.selected);
	};

	return (
		<div className="container">
			<h1>HackerNews</h1>
			<form className="search-form" onSubmit={handleSubmit}>
				<input
					placeholder="Search for news"
					value={searchText}
					onChange={(e) => setSearchText(e.target.value)}
				/>
				<button type="submit">Search</button>
			</form>

			<div className="news-container">
				{isLoading ? (
					<p>Loading....</p>
				) : (
					articles.map((article) => (
						<NewCard key={article.objectID} article={article} />
					))
				)}
			</div>
			<ReactPaginate
				nextLabel=" >> "
				previousLabel=" << "
				breakLabel="..."
				forcePage={currentPage}
				pageCount={totalPages}
				pageRangeDisplayed={2}
				renderOnZeroPageCount={null}
				onPageChange={handlePageClick}
				className="pagination"
				activeClassName="active-page"
				previousClassName="previous-page"
				nextClassName="next-page"
			/>
		</div>
	);
};

export default NewsPage;
