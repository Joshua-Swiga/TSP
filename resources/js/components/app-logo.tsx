import LogoPng from '../../../scripts/3/3.png';

export default function AppLogo() {
    return (
        <>
            {/* <img src={LogoPng} alt="App logo" className="aspect-square size-12 sm:size-12 md:size-9 lg:size-10 rounded-xl object-cover shadow-lg shadow-pink-500/20 ring-1 ring-pink-300/30 transition-transform duration-200 hover:scale-[1.02] mx-auto sm:mx-0" /> */}
            <div className="ml-1 hidden sm:grid flex-1 text-left text-sm">
                <span className="mb-0.5 truncate leading-none font-semibold">Play or Pay Hub</span>
            </div>
        </>
    );
}
