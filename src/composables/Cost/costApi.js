const API_URL = 'https://bfgpekkkg4egxr7i2tjwtlvaim0riqdq.lambda-url.us-east-1.on.aws';

export async function saveQuote(state) {
    console.log('name: ', state.product?.name);
    if (!state.product?.name) {
        throw new Error('Product name required');
    }

    console.log('Am I in here? ', state.value);

    const payload = {
        ...state,
        product: { name: state.product.name },
        lastUpdated: new Date().toISOString()
    };

    console.log('Payload to save: ', JSON.stringify(payload, null, 2));

    const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    console.log('Save response: ', await res.text());

    if (!res.ok) throw new Error('Save failed');

    return res.json().catch(() => payload);
}

export async function loadQuote(quoteId, state) {
    if (!quoteId) {
        throw new Error('Quote ID required');
    }

    console.log('Loading quote with ID:', quoteId);

    const res = await fetch(`${API_URL}/${encodeURIComponent(quoteId)}`);

    console.log('Response: ', res);

    if (!res.ok) {
        console.log('Load failed, initializing new quote');
        // await saveQuote(); // NEEDS TO BE PASSING FORM STATE.
    }

    return res.json();
}

export async function getProducts() {
    const res = await fetch(`${API_URL}?action=loadList`, {
        method: 'GET'
    });

    if (!res.ok) {
        throw new Error('Product load failed');
    }

    return await res.json();
}

export async function simulateQuote(state) {
    if (!state.product?.name) {
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
