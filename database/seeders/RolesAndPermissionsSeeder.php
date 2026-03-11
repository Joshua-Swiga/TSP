<?php

namespace Database\Seeders;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class RolesAndPermissionsSeeder extends Seeder
{

    public function run(): void
    {
        app()['cache']->forget('spatie.permission.cache');

        $admin = Role::create([
            'name'=>'admin',
        ]);

        $adminPermissions = [
            'view admin dashboard',
            'approve transaction',
        ];
        foreach($adminPermissions as $adminPerm){
            Permission::firstOrCreate(['name'=>$adminPerm]);
        }

    }
}
