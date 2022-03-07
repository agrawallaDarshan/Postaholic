import { SearchOutlined } from "@ant-design/icons";
const SearchUser = ({ search, setSearch, handleSearch }) => {
  return (
    <>
      <div
        className="row"
        style={{
          marginBottom: "1rem",
        }}
      >
        <div className="col-10">
          <input
            type="search"
            className="form-control bg"
            placeholder="Search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
          />
        </div>
        <div className="col-2">
          <button
            className="btn btn-outline-primary col-12"
            onClick={handleSearch}
          >
            <SearchOutlined />
          </button>
        </div>
      </div>
    </>
  );
};

export default SearchUser;
