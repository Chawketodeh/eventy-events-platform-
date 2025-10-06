type SearchProps = {
  placeholder?: string;
};

const Search = ({ placeholder = "Search..." }: SearchProps) => {
  return (
    <input type="text" placeholder={placeholder} className="input-field" />
  );
};

export default Search;
