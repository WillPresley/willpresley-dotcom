require 'digest'

module Jekyll
    module GetFileHash
        def sha512(input)
            fixed_input = input.to_s
            file_path = Pathname.new(fixed_input)
            Digest::SHA512.base64digest File.read file_path
        end
    end
end

Liquid::Template.register_filter(Jekyll::GetFileHash)
