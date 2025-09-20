function Button({ text, onClick, disabled, Icon }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="
        flex items-center justify-center gap-2
        px-8 py-3 rounded-xl font-bold text-lg text-white shadow-lg
        transition-all duration-500
        bg-gradient-to-r from-red-500 via-pink-500 to-orange-500
        hover:from-red-600 hover:via-pink-600 hover:to-orange-600
        hover:scale-110 hover:shadow-2xl
        disabled:opacity-50 disabled:cursor-not-allowed
      "
    >
      {Icon && <Icon className="w-5 h-5" />}
      {text}
    </button>
  );
}

export default Button;