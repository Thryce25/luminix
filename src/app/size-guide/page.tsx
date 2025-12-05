import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Size Guide',
};

export default function SizeGuidePage() {
    return (
        <div className="min-h-screen bg-black gothic-texture">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h1 className="text-4xl font-serif text-mist-lilac mb-8">Size Guide</h1>

                <div className="space-y-12 text-mist-lilac/70">
                    {/* Women's Sizing */}
                    <section>
                        <h2 className="text-2xl font-serif text-mist-lilac mb-6">Women's Clothing</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full border border-deep-purple/30">
                                <thead className="bg-deep-purple/20">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-mist-lilac">Size</th>
                                        <th className="px-4 py-3 text-left">Bust (in)</th>
                                        <th className="px-4 py-3 text-left">Waist (in)</th>
                                        <th className="px-4 py-3 text-left">Hips (in)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-deep-purple/20">
                                    <tr><td className="px-4 py-3">XS</td><td className="px-4 py-3">31-32</td><td className="px-4 py-3">24-25</td><td className="px-4 py-3">34-35</td></tr>
                                    <tr><td className="px-4 py-3">S</td><td className="px-4 py-3">33-34</td><td className="px-4 py-3">26-27</td><td className="px-4 py-3">36-37</td></tr>
                                    <tr><td className="px-4 py-3">M</td><td className="px-4 py-3">35-36</td><td className="px-4 py-3">28-29</td><td className="px-4 py-3">38-39</td></tr>
                                    <tr><td className="px-4 py-3">L</td><td className="px-4 py-3">37-39</td><td className="px-4 py-3">30-32</td><td className="px-4 py-3">40-42</td></tr>
                                    <tr><td className="px-4 py-3">XL</td><td className="px-4 py-3">40-42</td><td className="px-4 py-3">33-35</td><td className="px-4 py-3">43-45</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* Men's Sizing */}
                    <section>
                        <h2 className="text-2xl font-serif text-mist-lilac mb-6">Men's Clothing</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full border border-deep-purple/30">
                                <thead className="bg-deep-purple/20">
                                    <tr>
                                        <th className="px-4 py-3 text-left text-mist-lilac">Size</th>
                                        <th className="px-4 py-3 text-left">Chest (in)</th>
                                        <th className="px-4 py-3 text-left">Waist (in)</th>
                                        <th className="px-4 py-3 text-left">Sleeve (in)</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-deep-purple/20">
                                    <tr><td className="px-4 py-3">S</td><td className="px-4 py-3">34-36</td><td className="px-4 py-3">28-30</td><td className="px-4 py-3">32-33</td></tr>
                                    <tr><td className="px-4 py-3">M</td><td className="px-4 py-3">38-40</td><td className="px-4 py-3">32-34</td><td className="px-4 py-3">33-34</td></tr>
                                    <tr><td className="px-4 py-3">L</td><td className="px-4 py-3">42-44</td><td className="px-4 py-3">36-38</td><td className="px-4 py-3">34-35</td></tr>
                                    <tr><td className="px-4 py-3">XL</td><td className="px-4 py-3">46-48</td><td className="px-4 py-3">40-42</td><td className="px-4 py-3">35-36</td></tr>
                                    <tr><td className="px-4 py-3">XXL</td><td className="px-4 py-3">50-52</td><td className="px-4 py-3">44-46</td><td className="px-4 py-3">36-37</td></tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-serif text-mist-lilac mb-4">Measuring Tips</h2>
                        <p>For the most accurate measurements, wear form-fitting clothing and use a soft measuring tape. If you're between sizes, we recommend sizing up.</p>
                    </section>
                </div>
            </div>
        </div>
    );
}
