const API_URL = 'https://bfgpekkkg4egxr7i2tjwtlvaim0riqdq.lambda-url.us-east-1.on.aws';

export async function saveQuote(state) {
    if (!state.product?.quote) {
        throw new Error('Quote ID required');
    }

    const payload = {
        ...state,
        lastUpdated: new Date().toISOString()
    };

    const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (!res.ok) throw new Error('Save failed');

    return res.json().catch(() => payload);
}

export async function loadQuote(quoteId) {
    if (!quoteId) {
        throw new Error('Quote ID required');
    }

    const res = await fetch(`${API_URL}/${encodeURIComponent(quoteId)}`);

    if (!res.ok) throw new Error('Load failed');

    return res.json();
}

export async function simulateQuote(state) {
    if (!state.product?.quote) {
        throw new Error('Quote ID required');
    }

    const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            action: 'simulate',
            data: {
                ...state,
                lastUpdated: new Date().toISOString()
            }
        })
    });

    if (!res.ok) throw new Error('Simulation failed');

    return res.json();
}
