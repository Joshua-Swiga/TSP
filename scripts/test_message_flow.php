<?php

require __DIR__ . '/../vendor/autoload.php';

$app = require_once __DIR__ . '/../bootstrap/app.php';

// Boot the kernel
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

try {
    // ensure there is a user
    $user = App\Models\User::first();
    if (! $user) {
        // try to use factory if available
        if (class_exists(App\Models\User::class) && method_exists(App\Models\User::class, 'factory')) {
            $user = App\Models\User::factory()->create(['name' => 'tinker', 'email' => 'tinker'.time().'@example.com']);
        } else {
            // fallback minimal user creation
            $user = new App\Models\User();
            $user->name = 'tinker';
            $user->email = 'tinker'.time().'@example.com';
            $user->password = bcrypt('secret');
            $user->save();
        }
    }

    // login user
    Illuminate\Support\Facades\Auth::login($user);

    // create channel
    $channel = App\Models\channelModel::create(['name' => Illuminate\Support\Str::random(8), 'description' => 'tinker test']);

    // build request
    $request = Illuminate\Http\Request::create('/messages', 'POST', ['message' => 'hello from tinker', 'type_of_message' => 'text', 'channel_id' => $channel->id]);

    // call controller
    $controller = app(App\Http\Controllers\messagesFunctionality::class);
    $response = $controller->createMessage($request);

    echo "Response status: " . ($response->getStatusCode() ?? 'n/a') . PHP_EOL;
    echo "Response body: " . $response->getContent() . PHP_EOL;

} catch (Throwable $e) {
    echo "Error: " . $e->getMessage() . PHP_EOL;
}

