<?php

namespace App\Auth;

class NewAccessToken
{
    public $accessToken;
    public $plainTextToken;

    public function __construct($accessToken, string $plainTextToken)
    {
        $this->accessToken = $accessToken;
        $this->plainTextToken = $plainTextToken;
    }

    public function toArray()
    {
        return [
            'accessToken' => $this->accessToken,
            'plainTextToken' => $this->plainTextToken,
        ];
    }
}

